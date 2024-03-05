// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./libs/CurveBabyJubJub.sol";
import "./interfaces/IDKG.sol";
import "./interfaces/IVerifier.sol";
import "./interfaces/IVerifier.sol";
import "./libs/Math.sol";
import "./Opcode.sol";

contract DKG is IDKG, Opcode {
    address public  owner;
    DKGConfig public config;
    State public state;
    BabyJubPoint public PK_COMMITTEE;

    mapping(address => uint256) public CommitteeIndices;
    mapping(uint256 => mapping(uint256 => BabyJubPoint)) public Commitment;
    mapping(uint256 => mapping(uint256 => uint256)) public Encrypted;
    mapping(uint256 => mapping(uint256 => BabyJubPoint)) public Disclosure;

    error UnauthorizedAddress(address sender);
    error UnexpectedArrayLength();
    error AlreadyCommitted(address sender);
    error AlreadyRegistered(address sender);
    error AlreadyContributed(address sender);
    error NotInCommittingStage();
    error NotInRegisterStage();
    error NotInContributingStage();
    error NotInReadyStage();
    error NotOnCurve();
    error InvalidProof();

    event Registered(address indexed member, uint256 indexed memberIndex);
    event UpdateState(Stage stage);
    event Commit(address indexed member, uint256 indexed memberIndex);
    event Contribute(address indexed member, uint256 indexed memberIndex);
    event Reveal(uint256 indexed pkx, uint256 indexed pky, address member);

    modifier onlyCommitteeMember(address sender) {
        uint256 committeeIndex = CommitteeIndices[sender];
        if (committeeIndex == 0) revert UnauthorizedAddress(sender);
        _;
    }

    modifier onlyOwner(address sender) {
        if (sender != owner) revert UnauthorizedAddress(sender);
        _;
    }

    constructor(DKGConfig memory _config, address[] memory initMembers) {
        owner = msg.sender;
        config = _config;
        state = State({stage: Stage.Register, accumulator: 0});
        PK_COMMITTEE = BabyJubPoint(0, 1);
        uint256 length = (_config.N_COMMITTEE > initMembers.length) ? initMembers.length : _config.N_COMMITTEE;
        for (uint256 i = 0; i < length; i++) {
            register((initMembers[i]));
        }
    }

    function round1(BabyJubPoint[] calldata P) external onlyCommitteeMember(msg.sender) {
        if (P.length != config.T_COMMITTEE) revert UnexpectedArrayLength();
        if (state.stage != Stage.Committing) revert NotInCommittingStage();
        uint256 index = CommitteeIndices[msg.sender];
        // only need check the first elment of commiment[index].
        bool notYetCommitted = Commitment[index][0].x == 0 && Commitment[index][0].y == 0;
        if (!notYetCommitted) revert AlreadyCommitted(msg.sender);
        for (uint256 i = 0; i < config.T_COMMITTEE; i++) {
            if (!CurveBabyJubJub.isOnCurve(P[i].x, P[i].y)) revert NotOnCurve();
        }
        // update Commitment
        for (uint256 i = 0; i < config.T_COMMITTEE; i++) {
            (Commitment[index][i].x, Commitment[index][i].y) = (P[i].x, P[i].y);
        }
        (PK_COMMITTEE.x, PK_COMMITTEE.y) = CurveBabyJubJub.pointAdd(PK_COMMITTEE.x, PK_COMMITTEE.y, P[0].x, P[0].y);
        updateState(Stage.Contributing);
        emit Commit(msg.sender, index);
    }

    function round2(Round2Params calldata params) external onlyCommitteeMember(msg.sender) {
        if (state.stage != Stage.Contributing) revert NotInContributingStage();
        uint256 index = CommitteeIndices[msg.sender];
        (uint256 T_COMMITTEE, uint256 N_COMMITTEE, address verifier) =
            (config.T_COMMITTEE, config.N_COMMITTEE, config.verifier);
        if (params.encrypted.length != N_COMMITTEE - 1) {
            revert UnexpectedArrayLength();
        }
        // need to check AlreadyContributed error.
        if (Encrypted[index][index] != 0) revert AlreadyContributed(msg.sender);

        // aggregate public input from contract
        uint256[] memory publicInputs = new uint256[](
            IVerifier(verifier).publicInputsLength(OPCODE_ROUND2)
        );

        uint256 offset = 0;
        //Commitment
        for (uint256 i = 0; i < T_COMMITTEE; i++) {
            publicInputs[2 * i] = Commitment[index][i].x;
            publicInputs[2 * i + 1] = Commitment[index][i].y;
        }
        offset += 2 * T_COMMITTEE;
        // pkB
        for (uint256 i = 1; i <= N_COMMITTEE; i++) {
            if (i == index) continue;
            uint256 shift = (i > index) ? i - 2 : i - 1;
            publicInputs[offset + 2 * shift] = Commitment[i][0].x;
            publicInputs[offset + 2 * shift + 1] = Commitment[i][0].y;
        }
        offset += 2 * (N_COMMITTEE - 1);
        // indexB
        for (uint256 i = 1; i <= N_COMMITTEE; i++) {
            if (i == index) continue;
            uint256 shift = (i > index) ? i - 2 : i - 1;
            publicInputs[offset + shift] = i;
        }

        offset += N_COMMITTEE - 1;
        // encrypted
        for (uint256 i = 0; i < N_COMMITTEE - 1; i++) {
            publicInputs[offset++] = params.encrypted[i];
        }
        if (!IVerifier(verifier).verifyProof(OPCODE_ROUND2, params.proof, publicInputs)) revert InvalidProof();
        for (uint256 i = 1; i <= N_COMMITTEE; i++) {
            if (i == index) {
                Encrypted[index][i] = Math.Zp;
                continue;
            }
            uint256 shift = (i > index) ? i - 2 : i - 1;
            Encrypted[index][i] = params.encrypted[shift];
        }
        updateState(Stage.Ready);
        emit Contribute(msg.sender, index);
    }

    function reveal(RevealParams calldata params) external onlyCommitteeMember(msg.sender) {
        if (state.stage != Stage.Ready) revert NotInReadyStage();
        uint256 index = CommitteeIndices[msg.sender];
        (uint256 T_COMMITTEE, uint256 N_COMMITTEE, address verifier) =
            (config.T_COMMITTEE, config.N_COMMITTEE, config.verifier);

        // aggregate public input from contract
        uint256[] memory publicInputs = new uint256[](
            IVerifier(verifier).publicInputsLength(OPCODE_REVEAL)
        );

        uint256 offset = 0;
        //Commitment
        for (uint256 i = 0; i < T_COMMITTEE; i++) {
            publicInputs[2 * i] = Commitment[index][i].x;
            publicInputs[2 * i + 1] = Commitment[index][i].y;
        }
        offset += 2 * T_COMMITTEE;

        // pkB
        for (uint256 i = 1; i <= N_COMMITTEE; i++) {
            if (i == index) continue;
            uint256 shift = (i > index) ? i - 2 : i - 1;
            publicInputs[offset + 2 * shift] = Commitment[i][0].x;
            publicInputs[offset + 2 * shift + 1] = Commitment[i][0].y;
        }
        offset += 2 * (N_COMMITTEE - 1);
        // encrypted
        for (uint256 i = 1; i <= N_COMMITTEE; i++) {
            if (i == index) continue;
            uint256 shift = (i > index) ? i - 2 : i - 1;
            publicInputs[offset + shift] = Encrypted[i][index];
        }
        offset += N_COMMITTEE - 1;
        // pkAddressIn
        publicInputs[offset] = params.pkAddressIn[0];
        publicInputs[offset + 1] = params.pkAddressIn[1];
        // D
        publicInputs[offset + 2] = params.D[0];
        publicInputs[offset + 3] = params.D[1];
        // index
        publicInputs[offset + 4] = index;

        if (!IVerifier(verifier).verifyProof(OPCODE_REVEAL, params.proof, publicInputs)) revert InvalidProof();
        // update params
        for (uint256 i = 0; i < 2; i++) {
            Disclosure[params.pkAddressIn[0]][index] = BabyJubPoint(params.D[0], params.D[1]);
        }
        emit Reveal(params.pkAddressIn[0], params.pkAddressIn[1], msg.sender);
    }

    function register(address member) public onlyOwner(msg.sender) {
        if (state.stage != Stage.Register) revert NotInRegisterStage();
        if (CommitteeIndices[member] != 0) {
            revert AlreadyRegistered(member);
        }
        CommitteeIndices[member] = state.accumulator + 1;
        updateState(Stage.Committing);
    }

    function updateState(Stage nextStage) internal {
        uint256 accumulator = state.accumulator;
        accumulator++;
        if (accumulator == config.N_COMMITTEE) {
            state.accumulator = 0;
            state.stage = nextStage;
            emit UpdateState(nextStage);
            return;
        }
        state.accumulator = accumulator;
    }
}
