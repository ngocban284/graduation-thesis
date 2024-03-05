
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IHasher.sol";

contract MerkleTreeWithHistory {
    uint256 public constant FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 public constant ZERO_VALUE = 3042774122929058629117742057409317273972932196304097622662323601237587181833; // = keccak256("mixer") % FIELD_SIZE
    IHasher public immutable hasher;
    uint32 public levels;
    mapping(uint256 => uint256) public filledSubtrees;
    mapping(uint256 => uint256) public roots;
    uint32 public constant ROOT_HISTORY_SIZE = 30;
    uint32 public currentRootIndex = 0;
    uint32 public nextIndex = 0;

    constructor(uint32 _levels, address _hasher) {
        require(_levels > 0, "_levels should be greater than zero");
        require(_levels < 32, "_levels should be less than 32");
        levels = _levels;
        hasher = IHasher(_hasher);

        for (uint32 i = 0; i < _levels; i++) {
            filledSubtrees[i] = zeros(i);
        }

        roots[0] = zeros(_levels - 1);
    }

    /**
     * @dev Hash 2 tree leaves, returns MiMC(_left, _right)
     */
    function hashLeftRight(IHasher _hasher, uint256 _left, uint256 _right) public pure returns (uint256) {
        require(_left < FIELD_SIZE, "_left should be inside the field");
        require(_right < FIELD_SIZE, "_right should be inside the field");
        uint256[] memory params = new uint256[](2);
        params[0] = _left;
        params[1] = _right;
        return (_hasher.poseidon(params));
    }

    function _insert(uint256 _leaf) internal returns (uint32 index) {
        uint32 _nextIndex = nextIndex;
        require(_nextIndex != uint32(2) ** levels, "Merkle tree is full. No more leaves can be added");
        uint32 currentIndex = _nextIndex;
        uint256 currentLevelHash = _leaf;
        uint256 left;
        uint256 right;

        for (uint32 i = 0; i < levels; i++) {
            if (currentIndex % 2 == 0) {
                left = currentLevelHash;
                right = zeros(i);
                filledSubtrees[i] = currentLevelHash;
            } else {
                left = filledSubtrees[i];
                right = currentLevelHash;
            }
            currentLevelHash = hashLeftRight(hasher, left, right);
            currentIndex /= 2;
        }

        uint32 newRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
        currentRootIndex = newRootIndex;
        roots[newRootIndex] = currentLevelHash;
        nextIndex = _nextIndex + 1;
        return _nextIndex;
    }

    /**
     * @dev Whether the root is present in the root history
     */
    function isKnownRoot(uint256 _root) public view returns (bool) {
        if (_root == 0) {
            return false;
        }
        uint32 _currentRootIndex = currentRootIndex;
        uint32 i = _currentRootIndex;
        do {
            if (_root == roots[i]) {
                return true;
            }
            if (i == 0) {
                i = ROOT_HISTORY_SIZE;
            }
            i--;
        } while (i != _currentRootIndex);
        return false;
    }
    /**
     * @dev Returns the last root
     */

    function getLastRoot() public view returns (uint256) {
        return roots[currentRootIndex];
    }
    /// @dev provides Zero (Empty) elements for a Poseidon MerkleTree. Up to 32 levels

    function zeros(uint256 i) public pure returns (uint256) {
        if (i == 0) return uint256(3042774122929058629117742057409317273972932196304097622662323601237587181833);
        else if (i == 1) return uint256(3030537474978048480227489754210145533429309138503618523729328712412381522266);
        else if (i == 2) return uint256(18027402361360721160682939931228781222444737484226645011061022782057337034560);
        else if (i == 3) return uint256(18636934510315044255872112941605854893792963540810931409819250505424486060726);
        else if (i == 4) return uint256(10912096938962850033115427396772600330444999457724492435841893039317441269636);
        else if (i == 5) return uint256(2214710847670638638594204068112806823906038031529613614362172728284686814362);
        else if (i == 6) return uint256(4996947268850122260998021672433826123371181027124910132690691570644641975606);
        else if (i == 7) return uint256(684803838509305980428731150110221018031186332073426725736947238069046529972);
        else if (i == 8) return uint256(16158029507610961103134862299318781772018993881006211273594332068202679260316);
        else if (i == 9) return uint256(4462632474441496333349238205560949852176252756594243152158720754632557855187);
        else if (i == 10) return uint256(3471156805159905418037453948861620321363720604874005595672947810888020162040);
        else if (i == 11) return uint256(4192068329473779684251365832299218538883242435566450902368718009105406084177);
        else if (i == 12) return uint256(6506968369555880942320448331958181804038335962138903950878173593868876769463);
        else if (i == 13) return uint256(2688199660204700164349341370666096289609398587787836835247871383951388747427);
        else if (i == 14) return uint256(973415460110581591697234783538311358692406492019728142524912209340170527310);
        else if (i == 15) return uint256(7300661285542366477125516507774996732750744803463065772345299736834861741756);
        else if (i == 16) return uint256(4306896654319573329256847029520910569946454355811626919186442021693644047467);
        else if (i == 17) return uint256(10707535566416965033437367118023707681786053432184789483286040430546969167101);
        else if (i == 18) return uint256(533356604245105326347461106756157791995156010023709286150063115966239028647);
        else if (i == 19) return uint256(13438368679558763600202361976395361519440796072690458915150637181920859056123);
        else if (i == 20) return uint256(6624062596454096665030960178273913127334942163526969823419309431086405640358);
        else if (i == 21) return uint256(7582051610035577914563337020447249669504259458768078482246712612896511790106);
        else if (i == 22) return uint256(16844060583127282749914522111993972990384770248603391256287458176684138622403);
        else if (i == 23) return uint256(18020064421226253239222187350055383025877416998475023069797319979625085468088);
        else if (i == 24) return uint256(14213528855862921836349686186017955890963003438911640018367680519106934236562);
        else if (i == 25) return uint256(19061381104313418757989690920844724087316849579479721018830949419730788506153);
        else if (i == 26) return uint256(7577219133752520167987669452527634031513799857515644975588480034369706329179);
        else if (i == 27) return uint256(16614981565982740961687004963854369576859792026463784530861789912788608099998);
        else if (i == 28) return uint256(11545381338913168618664419509182877714575638545210712096668601457940958123954);
        else if (i == 29) return uint256(16655963899818672161528583837738802543201543550157448263724903814984781130870);
        else if (i == 30) return uint256(16136140105499752533626356287838668638487145851505229550606830587452938803875);
        else if (i == 31) return uint256(16518965397316045688697256391174622779417406894037343057823888999785761838500);
        else revert("Index out of bounds");
    }
}
