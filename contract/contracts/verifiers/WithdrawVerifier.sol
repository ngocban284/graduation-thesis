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

contract Groth16VerifierWithdraw {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 4017208478608733998961631692417335806951022111147371783098181204393309021865;
    uint256 constant alphay  = 15080222228602686238092131777327509604456384298594777679146933625115162336558;
    uint256 constant betax1  = 5665968831419080356906926211472020769490116907971242088668358896531529733522;
    uint256 constant betax2  = 13717208661748934312398806680516995397627439908443176829041602997641613902949;
    uint256 constant betay1  = 18649339230879428716049501349915460934361560209914435222453878144359008147835;
    uint256 constant betay2  = 20442414128944230685916118344134646094669954396010239981450316567660933874227;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 8998844006942108509294832391009870077446454481932717627258620096756351585379;
    uint256 constant deltax2 = 9406509854050605848804360277831071040396963965638091661646643066079249937642;
    uint256 constant deltay1 = 10566636724969751804720615683377290238971783450478165456264468724272831143618;
    uint256 constant deltay2 = 8527030477818178292551592703907875983300457053090386316815853179041480414918;

    
    uint256 constant IC0x = 14531610728954008287799824118962899456843884878789938179949367220994313031863;
    uint256 constant IC0y = 15462314823431848431810569269104258072335317998940223511205788591944334320337;
    
    uint256 constant IC1x = 8012108695105804727427331235568375635543360835610776504772384703548572675473;
    uint256 constant IC1y = 18877779300236282074595277598548305750774120937485800191080130942959715807417;
    
    uint256 constant IC2x = 10998091933062902150984508992448740576529882769450018046711692867075382641834;
    uint256 constant IC2y = 9364442141793379335175283699840684742101487924857075519702394557701380450784;
    
    uint256 constant IC3x = 12917657999914732284583619478386325157120895369922078661675010380636482494364;
    uint256 constant IC3y = 12062986453895950458931037430259231418617746117710330259380620813430365442255;
    
    uint256 constant IC4x = 20556576567178702994234922554952094971815844461971269735562982373233531707322;
    uint256 constant IC4y = 592288700743860191731164563800188775650075374540017429917223381017283612833;
    
    uint256 constant IC5x = 13550476072189392824281085774451457428381845567836701240340596802770026339995;
    uint256 constant IC5y = 7309760221558438302085766093902521401325745846148081101022702268003377871015;
    
    uint256 constant IC6x = 17560006037420596173644694482764769601134731148470682450249689694599954608303;
    uint256 constant IC6y = 7440692850904570018404161222229733967331095808426438834181319305898807039997;
    
    uint256 constant IC7x = 21782507997783946397425360319074934301128665576019761627243058788143217579379;
    uint256 constant IC7y = 17324361424239227685997057491400931242878839579287081089713237542129002126806;
    
    uint256 constant IC8x = 3477913833071928133787587304559329971982114416269987660942709306595528182728;
    uint256 constant IC8y = 10717067891965438941216527808534145933116602420559058053199578185738272632544;
    
    uint256 constant IC9x = 17529944829082557248147352963233537184090985058073671925792157652798441878590;
    uint256 constant IC9y = 7297308786415118461689451208312731334583235948292249286998060697037867000615;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[9] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }