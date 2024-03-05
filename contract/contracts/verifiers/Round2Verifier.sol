// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16VerifierRound2 {
    // Scalar field size
    uint256 constant r = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax = 3269952459539702293965569645258451996251256358040173962361294163501119057984;
    uint256 constant alphay = 8877278643049820549146427536658478456756086163250609516378633495930986325617;
    uint256 constant betax1 = 11843780710606788703356227282660920268903943975941059725346402796468386016163;
    uint256 constant betax2 = 19232121284310807736491270938778328662992813349456693542714395221049705484547;
    uint256 constant betay1 = 12118762327957716917663145003176240475921157114743934164976093473897112634932;
    uint256 constant betay2 = 8598146627726099534239669130850340799488249909228833705882308675753511309823;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 2343224382681807814682768352954764680627727152998606280623643837551069226699;
    uint256 constant deltax2 = 11501363731673387172956926548823652340257765286221359440197557836856944900150;
    uint256 constant deltay1 = 15551723055580836685878018422592271419944964715572527529966430812830270952918;
    uint256 constant deltay2 = 9586389549185485449725390242037126260039612758454040852670961470815277728638;

    uint256 constant IC0x = 15521285432339948917433306984467331425422317100808222522894395589562148564286;
    uint256 constant IC0y = 8030732643434597902491922694271038838322728682410442606742441076839233351304;

    uint256 constant IC1x = 18529415104607932884800849439500383893920914847399845385954530204613581176829;
    uint256 constant IC1y = 5270976972162583815637519731952996398959406863873918919474924542614523374848;

    uint256 constant IC2x = 14994606055176304175692906243840127550560763891875062422810112051833604950174;
    uint256 constant IC2y = 6835692898670281712357131596837546478398128215212669727667305670327779344006;

    uint256 constant IC3x = 18133009297123875911950401110708299874255691207824155588917154504306807831448;
    uint256 constant IC3y = 2702119210385972143472417977543941831144082785287899963335692116589314121336;

    uint256 constant IC4x = 2348662687524942744937943051321891098473397614815838906317639608187590366602;
    uint256 constant IC4y = 4253087642511121923455119250350733810107440819725034652514051680984835298888;

    uint256 constant IC5x = 11920594115194421346346701921868215696326059695251699517824212148654919103060;
    uint256 constant IC5y = 7291869823516356810862345815641178494662513143118723811871747822357043002740;

    uint256 constant IC6x = 20808058760691581304347264825497155143032226782113761447767712622221365561920;
    uint256 constant IC6y = 9899084485941486073947363073551312081653575169069497697222675638672230210331;

    uint256 constant IC7x = 16273551081341693312489070053509114268299895138067095227412834496208827197656;
    uint256 constant IC7y = 6556876849277125705141966163491850247198799405072923849222363103659994234886;

    uint256 constant IC8x = 4237168416300564768425321279787306935449886361919295819349455387756132708371;
    uint256 constant IC8y = 16253236082171099381590088528482420573653296301761026718872697075318585307760;

    uint256 constant IC9x = 12853002330131392867060167325300343756454740603999782262218359813589856079943;
    uint256 constant IC9y = 6058573205628833929374758130099886375722952861401154108345722406966294484489;

    uint256 constant IC10x = 2961009573007752826818325783712631789324913943969695124586049967252069409065;
    uint256 constant IC10y = 13865795096839559452850968865472515170739217693250948512350637506385744394482;

    uint256 constant IC11x = 18691893446317468616122327616985311235514732344588957154381290375935848766269;
    uint256 constant IC11y = 19126253408562455662522217339286128848063552702144814524215259899941619734268;

    uint256 constant IC12x = 19950353555444286392820156677496004529590641444563210254953923494748484827775;
    uint256 constant IC12y = 7358936438709275122366772274588584012629429549431001047309546462065741926527;

    uint256 constant IC13x = 11005306797864792846611247598472317449994249615647070301594907876012736522154;
    uint256 constant IC13y = 8095109470808517885415408719509362840127984568157821550273521070897258916833;

    uint256 constant IC14x = 9363054137648746065983478359811287233926311846736793137111593433585746385922;
    uint256 constant IC14y = 11813234954931117536524788281206556806751858290079853657283971888827621951044;

    uint256 constant IC15x = 10290465031366243270563927065741935970564112569964906252925182302246687351176;
    uint256 constant IC15y = 16268980698927402755076673641681121116493459977074369395435893531403249415529;

    uint256 constant IC16x = 20786968625175232178194570373352713635181051291853504177546425646694960853822;
    uint256 constant IC16y = 2542633541684158989912184766672629387241321671143195815362393158096227309265;

    uint256 constant IC17x = 20827684080756060737400582232346719457046857427110139052932108874934572188507;
    uint256 constant IC17y = 16025922029011254771979330898708641772749747529387152338750252113103494087556;

    uint256 constant IC18x = 15117063098647067405438624457632019353246212097472979986227288065740121008326;
    uint256 constant IC18y = 7374140270233380291097542916473741135538620741527257913256204280421869811860;

    uint256 constant IC19x = 16204903828537964502195160867221197564716578104503195264407155310894291540938;
    uint256 constant IC19y = 3692947199930971030808667455092621367418401195454662653853972628733897588487;

    uint256 constant IC20x = 7192291626414463569854111335568319687953580076396095046024920757749163204557;
    uint256 constant IC20y = 18382176250988351535662102109466559589930859309300191697731130162353281351391;

    uint256 constant IC21x = 82177059997168984668854476524048958698740209367159855020718696032906340621;
    uint256 constant IC21y = 9252167059037027478022908143715839482838795671513146019001444671866340661865;

    uint256 constant IC22x = 17957108159669278192407195229469943287526474657057645392655536321108049137837;
    uint256 constant IC22y = 4088169074105033599520369658925515976176525939964861450676866479771043369207;

    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function publicInputsLength() external pure returns (uint256) {
        return 22;
    }

    function verifyProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[22] calldata _pubSignals
    ) public view returns (bool) {
        // return true;
        assembly {
            function checkField(v) {
                if iszero(lt(v, q)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x

                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))

                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))

                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))

                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))

                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))

                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))

                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))

                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))

                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))

                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))

                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))

                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))

                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))

                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))

                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))

                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))

                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))

                g1_mulAccC(_pVk, IC18x, IC18y, calldataload(add(pubSignals, 544)))

                g1_mulAccC(_pVk, IC19x, IC19y, calldataload(add(pubSignals, 576)))

                g1_mulAccC(_pVk, IC20x, IC20y, calldataload(add(pubSignals, 608)))

                g1_mulAccC(_pVk, IC21x, IC21y, calldataload(add(pubSignals, 640)))

                g1_mulAccC(_pVk, IC22x, IC22y, calldataload(add(pubSignals, 672)))

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))

                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)

                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F

            checkField(calldataload(add(_pubSignals, 0)))

            checkField(calldataload(add(_pubSignals, 32)))

            checkField(calldataload(add(_pubSignals, 64)))

            checkField(calldataload(add(_pubSignals, 96)))

            checkField(calldataload(add(_pubSignals, 128)))

            checkField(calldataload(add(_pubSignals, 160)))

            checkField(calldataload(add(_pubSignals, 192)))

            checkField(calldataload(add(_pubSignals, 224)))

            checkField(calldataload(add(_pubSignals, 256)))

            checkField(calldataload(add(_pubSignals, 288)))

            checkField(calldataload(add(_pubSignals, 320)))

            checkField(calldataload(add(_pubSignals, 352)))

            checkField(calldataload(add(_pubSignals, 384)))

            checkField(calldataload(add(_pubSignals, 416)))

            checkField(calldataload(add(_pubSignals, 448)))

            checkField(calldataload(add(_pubSignals, 480)))

            checkField(calldataload(add(_pubSignals, 512)))

            checkField(calldataload(add(_pubSignals, 544)))

            checkField(calldataload(add(_pubSignals, 576)))

            checkField(calldataload(add(_pubSignals, 608)))

            checkField(calldataload(add(_pubSignals, 640)))

            checkField(calldataload(add(_pubSignals, 672)))

            checkField(calldataload(add(_pubSignals, 704)))

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
            return(0, 0x20)
        }
    }
}
