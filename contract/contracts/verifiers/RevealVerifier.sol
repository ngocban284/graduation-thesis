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

contract Groth16VerifierReveal {
    // Scalar field size
    uint256 constant r = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax = 15810629470194179801481419197305850000653705204616995629602768408535951120938;
    uint256 constant alphay = 19126378311846318738700236060290315697910593276718449847997004791104476688914;
    uint256 constant betax1 = 9784299725685345042441640139141902181309200883228673191368734239296148078785;
    uint256 constant betax2 = 15866888532285291659662507722383819146272579198518785423117089144644984193756;
    uint256 constant betay1 = 19224676927280699396866001147600093444794745709414738307307765680510002059322;
    uint256 constant betay2 = 18134427776882420901946838746999276656235282547000093366382462298869817439735;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 21208569097607414851438903539438901922598089634034836874161012899446146883067;
    uint256 constant deltax2 = 18590484366533972908911309393727852536697723197167380840165771414074460810904;
    uint256 constant deltay1 = 8310360947015230410545066760941922927111398195904789017112381846928382045962;
    uint256 constant deltay2 = 4230711384189389193475525627432772850064828111986222294831516133950718851009;

    uint256 constant IC0x = 11524885603342857183272508102342980864580806176051493799554451718712833071538;
    uint256 constant IC0y = 4853783247925198867868357260485442047962512749131349960848869962013545259171;

    uint256 constant IC1x = 9737814502410991961421767449693853708734720211522744674103590099880728317785;
    uint256 constant IC1y = 7410999139033293831562102684269308277359517965510992345300682984703946142393;

    uint256 constant IC2x = 8723537539729650663761551051100395473451621534505529601762746048626378970952;
    uint256 constant IC2y = 10151591956107177016039140679996867219670899346146249836695920222366046590501;

    uint256 constant IC3x = 5009044037210956171295531843308413223306423097329195809882064148178167854109;
    uint256 constant IC3y = 7126418775535257720053334068212647314190199123060618755920652303591930010277;

    uint256 constant IC4x = 14892149793385341140674914691696252514564746121317600809490958330069311192758;
    uint256 constant IC4y = 4801007838011087685784553659957405737068576426520516985152190861034572488250;

    uint256 constant IC5x = 763496391767468456773603093857637698465511783033843956580176089856703898430;
    uint256 constant IC5y = 4394708799010434393846834461137276803366870456415980709302667833392398412131;

    uint256 constant IC6x = 11930110898254748960356930594322428189377484743680600252222880190698121853150;
    uint256 constant IC6y = 13320965107354148010344317441419576883726108664462166276179099713576218787193;

    uint256 constant IC7x = 18862691719724863989115780165257102232410455059704330058364301213096841949159;
    uint256 constant IC7y = 1950094417434765832078822663116355803040279269528933283244680615637018871077;

    uint256 constant IC8x = 11568913393515077881673440494253866755078799457671140664254878337640230820253;
    uint256 constant IC8y = 2346582527991578345150202687789487739546735255902647884444707639641369619798;

    uint256 constant IC9x = 4538775830998795770918528754051208573077558348621613328155219924520164790471;
    uint256 constant IC9y = 9170257501054977942514050592026084903351267024766204177141843140672142862746;

    uint256 constant IC10x = 18680175181647506272848929556814205316400932148011713713779893577463257100306;
    uint256 constant IC10y = 4776018582403653195127000929476730288842960851933407454148104658422895083070;

    uint256 constant IC11x = 13767172673623132757888070086860836671056315518307673242241001625127993920318;
    uint256 constant IC11y = 1807515961300034942841339462214155406641513075192604564662309142463674838767;

    uint256 constant IC12x = 16515767697712768120060320289717468219516753361460118821552383985924501321617;
    uint256 constant IC12y = 12660006850979816558512542821880080511187438320114122539396870789432009825567;

    uint256 constant IC13x = 13199348372301376603023339520991453390179341904812495510561827737301346712120;
    uint256 constant IC13y = 16900420554619296982504290306276017895829520002202883064254387659070373944361;

    uint256 constant IC14x = 2400012298134796082211814806985677382978773189714383563448785691344813373799;
    uint256 constant IC14y = 17629040152107031805856486163594983416160262086035369207514960940645224371460;

    uint256 constant IC15x = 969774584591382219952346592062668072741205054443494901979783673489519747644;
    uint256 constant IC15y = 10882061546898546830800324938411505880815290375809536090813032337133992056396;

    uint256 constant IC16x = 3358324451792506688078319574404506497424106342971139983008794379268333138073;
    uint256 constant IC16y = 14841992726870832946141328084005302878667619580018444315978475971235411577791;

    uint256 constant IC17x = 17999770631094132894605635140742035602143926642137179051615687233320788805753;
    uint256 constant IC17y = 15652017338444267109094180671276929529509260350706563602399493947562845346001;

    uint256 constant IC18x = 6148860741365334851760106374431456561128581466013238366886847226728924335670;
    uint256 constant IC18y = 15706040634330651955695504501327944700344565922939352339744725035037868710497;

    uint256 constant IC19x = 410263014352259201712058829136083020122922337783165830864289482236811199567;
    uint256 constant IC19y = 11259685063723720450190250585567443600739927067343506933015837314281275523202;

    uint256 constant IC20x = 10272532102849268451213296899684498988504339323980923544483868040174725167496;
    uint256 constant IC20y = 18765712716113986942586247787601204220780303187781554098909236963718087919038;

    uint256 constant IC21x = 4461529368643477559608236232676948547764202232957618332482513462176654239381;
    uint256 constant IC21y = 20804257631272495275686673768204500281663607022892245984706787393228464600177;

    uint256 constant IC22x = 9669417010771877911477766863424580381622482642480514389887640423131899810432;
    uint256 constant IC22y = 3024688156909196376050707678411972443266571307014502716054669794576470332068;

    uint256 constant IC23x = 3407810119100760173370983019128132753658297686302787888405069092940223925220;
    uint256 constant IC23y = 19470238160157271678618419710932906355216747045747894153417051355915359217406;

    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function publicInputsLength() external pure returns (uint256) {
        return 23;
    }

    function verifyProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[23] calldata _pubSignals
    ) public view returns (bool) {
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

                g1_mulAccC(_pVk, IC23x, IC23y, calldataload(add(pubSignals, 704)))

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

            checkField(calldataload(add(_pubSignals, 736)))

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
            return(0, 0x20)
        }
    }
}
