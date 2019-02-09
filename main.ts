//% weight=0 color=#FF8B27 icon="\uf1b9" block="TobbieII"
//uf1b9
namespace TobbieII {
    let ADL_R: number = 0;
    let ADH_R: number = 0;
    let ADL_L: number = 0;
    let ADH_L: number = 0;
    let Read_LIR: number = 0;
    let Read_RIR: number = 0;
    let event_src_ir = 12;
    let event_ir_sensor = 1;
    let Motor_R: boolean = false;
    let Motor_L: boolean = false;
    let PX: number = 0;
    let PY: number = 0;
    let Force: number = 10;
 
    /**
    *向前行走
    */
    //% blockId="forward" block="Tobbie-II walk forward"
    //% blockGap=3 weight=35
    export function forward() {
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P14, 0)
        }
    }
    /**
    *向後行走
    */
    //% blockId="backward" block="Tobbie-II walk  backward"
    //% blockGap=3  weight=34
    export function backward() {
        if (Force != 0) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            Force = Force - 1;
        }
        if (pins.digitalReadPin(DigitalPin.P8) == 1) {Force=10} 

    }
    
}

