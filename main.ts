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
    
   function IR_sensorL(irdataL: number) {   //此為中斷觸發方塊
       control.inBackground(() => {
           let flag = false
           let last_flag = false
            while (true) { 
                let ob: boolean = LBlock();
                if(ob){flag=true}else{flag=false}
                if (flag != last_flag) {
                    if (flag) { 
                        control.raiseEvent(event_src_ir, event_ir_sensor)
                        basic.pause(300) //300ms
                    }
                    last_flag = flag
                }
                basic.pause(1)
                
            } 
            
        }      
        )

    }
//    /**
//    *背景執行紅外線測距
//    *@param irdata_Set ; eg: 512
//    */
//    //% blockId="IR_EVENTL" block="ON obstacles on the left: |%irdata_Set"
//    //% irdata_Set.min=0 irdata_Set.max=1023
//    //% blockGap=10 weight=99   //代表其重要性，越重放越高
//    export function onIRL(irdata_Set: number = 512, handler: Action) {
//       IR_sensorL(irdata_Set);
//        control.onEvent(event_src_ir, event_ir_sensor, handler); 

//   }
//    function IR_sensorR(irdata: number) { 
//        control.inBackground(() => {
//           let flag = false
//            let last_flag = false
//            while (true) {
//                let ob: boolean = LBlock();
//                if(ob){flag=true}else{flag=false}
//                if (flag != last_flag) {
//                    if (flag) { 
//                        control.raiseEvent(event_src_ir, event_ir_sensor)
//                        basic.pause(3)
//                    }
//                    last_flag = flag
//                }
//                basic.pause(1)
//            }   
//        }      
//        )
//    }
 
    /** 讀取右側紅外線感應到的值
    */
    //% blockId="Read_RBolck" block="Get right IR data(return 0~1024)"
    //% blockGap=5 weight=65                 //與下一個方塊的間隙及排重
    export function Read_RBlock() :number {
        ADL_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 0)
        if (pins.digitalReadPin(DigitalPin.P8) == 1) Read_RIR = ADH_R - ADL_R;
        return (Read_RIR)     
    }
    /** 讀取左側紅外線感應到的值
    */
    //% blockId="Read_LBolck" block="Get left IR data(trtuen 0~1024)"
    //% blockGap=15 weight=60                 //與下一個方塊的間隙及排重
    export function Read_LBlock() :number {
        ADL_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 0)

        Read_LIR = ADH_L - ADL_L;
        return(Read_LIR)       
    }
/**
    *判斷右邊是否有障礙物
    *@param thresholdR ; eg: 512
    */
    //% blockId="RBolck" block="Is Right IR over %thresholdR strength"
    //% thresholdR.min=0 thresholdR.max=1023
    //% blockGap=5 weight=58
    export function RBlock(thresholdR: number = 512 ) :boolean {
        ADL_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_R = pins.analogReadPin(AnalogPin.P2)
        pins.digitalWritePin(DigitalPin.P12, 0)

        if (((ADH_R-ADL_R) > thresholdR) && (pins.digitalReadPin(DigitalPin.P8) == 1)) { 
             //basic.showIcon(IconNames.House)
            return(true)
        } else {
            //basic.showIcon(IconNames.Cow)
            return(false) 
        }     
    }
    /**
    *判斷左邊是否有障礙物
    *@param thresholdL ; eg: 512
    */
    //% blockId="LBolck" block="Is Left IR over %thresholdL strength"
    //% thresholdL.min=0 thresholdL.max=1023
    //% blockGap=10 weight=57
    export function LBlock(thresholdL: number=512 ) :boolean {
        ADL_L = pins.analogReadPin(AnalogPin.P1)
        pins.digitalWritePin(DigitalPin.P12, 1)
        control.waitMicros(250)
        ADH_L = 0
        if(pins.digitalReadPin(DigitalPin.P8) == 1){
            ADH_L = pins.analogReadPin(AnalogPin.P1)
            pins.digitalWritePin(DigitalPin.P12, 0)
        }

        if ((ADH_L-ADL_L) > thresholdL) {//512) { 
             //basic.showIcon(IconNames.House)
            return(true)
        } else {
            //basic.showIcon(IconNames.Cow)
            return(false) 
        }     
    }
    
    /**
    *輸出脈波*/
    //% blockId="IRbolck" block="Out pulse & show-04"
    //% blockGap=10 weight=55
    //export function IRblock() {
    //    ADL_L = pins.analogReadPin(AnalogPin.P1)
    //    ADL_R = pins.analogReadPin(AnalogPin.P2)
    //    pins.digitalWritePin(DigitalPin.P12, 1)
    //    control.waitMicros(250)
    //    ADH_L = pins.analogReadPin(AnalogPin.P1)
    //    ADH_R = pins.analogReadPin(AnalogPin.P2)
    //    pins.digitalWritePin(DigitalPin.P12, 0)
    
    //    if ((ADH_L-ADL_L) > 512) { 
            //basic.showIcon(IconNames.House)
    //        led.plot(0, 0)
    //        led.unplot(0,4)
    //    } else {
            //basic.showIcon(IconNames.Cow)
    //        led.plot(0, 4)
    //        led.unplot(0,0)
    //    }

    //    if ((ADH_R-ADL_R) > 512) { 
            //basic.showIcon(IconNames.House)
    //        led.plot(4, 0)
    //        led.unplot(4, 4)
    //   } else {
           //basic.showIcon(IconNames.Cow)
    //        led.plot(4, 4)
    //        led.unplot(4,0)
    //       }
        
     //return(true)       
    //}
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
    /**
    *停止行走
    */
    //% blockId="stopwalk" block="Tobbie-II stop walk"
    //% blockGap=10 weight=33
    export function stopwalk() {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    /**
    *向右旋轉
    */
    //% blockId="rightward" block="Tobbie-II turn right"
    //% blockGap=3  weight=32
    export function rightward() {
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
        Motor_L=false
        Motor_R=true
    }
    /**
    *向左旋轉
    */
    //% blockId="leftward" block="Tobbie-II turn left"
    //% blockGap=3  weight=31
    export function leftward() {
       pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
        Motor_L=true
        Motor_R=false
    }
    /**
    *停止旋轉煞車
    */
    //% blockId="stopturn" block="Tobbie-II stop turn"
    //% blockGap=10 weight=30
    export function stopturn() {
        if (Motor_L || Motor_R) {
            if (Motor_R) { 
                pins.digitalWritePin(DigitalPin.P15, 1)
                pins.digitalWritePin(DigitalPin.P16, 0)
            } else {
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 1)
            }
            basic.pause(50)
         }
         if (pins.digitalReadPin(DigitalPin.P8) == 1){
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
        Motor_L=false
        Motor_R=false }
    }
    
 /**
    *前後振動
    *@param time describe parameter here, eg:5
    */
    //% blockId="vibrate" block="Tobbie-II vibrate %time times"
    //% time.min=1 time.max=100
    //% blockGap=5 weight=25
    //% advanced=true
    export function vibrate(time:number) :void{
        for (let i = 0; i < time; i++){
            pins.digitalWritePin(DigitalPin.P13, 1)  //向前
            pins.digitalWritePin(DigitalPin.P14, 0)
            basic.pause(150)
            pins.digitalWritePin(DigitalPin.P13, 0)  //向後
            pins.digitalWritePin(DigitalPin.P14, 1)
            basic.pause(150)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)      //停止
        pins.digitalWritePin(DigitalPin.P14, 0)
    }   
 /**
    *左右搖頭
    *@param time describe parameter here, eg:5
    */
    //% blockId="shake_head" block="Tobbie-II shake head %time times"
    //% time.min=1 time.max=100
    //% blockGap=5 weight=26
    //% advanced=true
    export function shake_head(time:number) :void{
        for (let i = 0; i < time; i++){
            pins.digitalWritePin(DigitalPin.P15, 1)  //左轉
            pins.digitalWritePin(DigitalPin.P16, 0)
            basic.pause(250)
            pins.digitalWritePin(DigitalPin.P15, 0)  //右轉
            pins.digitalWritePin(DigitalPin.P16, 1)
            basic.pause(250)
        }
        pins.digitalWritePin(DigitalPin.P15, 0)      //停止行走
        pins.digitalWritePin(DigitalPin.P16, 0)
    }      
/**
    *跳舞搖頭加振動
    *@param time describe parameter here, eg:5
    */
    //% blockId="dance" block="Tobbie-II dance %time time"
    //% time.min=1 time.max=100
    //% blockGap=5 weight=24
    //% advanced=true
    export function dance(time:number) :void{
        for (let i = 0; i < time; i++){
            pins.digitalWritePin(DigitalPin.P13, 0)  //向後
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.digitalWritePin(DigitalPin.P15, 0)  //右轉
            pins.digitalWritePin(DigitalPin.P16, 1)
            basic.pause(250)
            pins.digitalWritePin(DigitalPin.P13, 1)  //向前
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.digitalWritePin(DigitalPin.P15, 1)  //左轉
            pins.digitalWritePin(DigitalPin.P16, 0)
            basic.pause(250)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P16, 0)
    } 
/**
    *藍牙專用
    *@param RX_Data describe parameter here
    */
    //% blockId="BLE_DOT" block="Draw your face(APP only) %RX_Data"
    //% blockGap=5 weight=23
    //% advanced=true
    export function Drawface(RX_Data: string): void{
        basic.clearScreen()
        for (let PY = 0; PY <= 4; PY++) {
            let PLOT_DATA:number = parseInt(RX_Data.substr(PY * 2 + 1, 2))
            for (let PX = 0; PX <= 4; PX++) {
                if (PLOT_DATA % 2 == 1) {
                    led.plot(PX, PY)
                    PLOT_DATA = PLOT_DATA - 1
                }
                PLOT_DATA = PLOT_DATA / 2
            }
        }
    }      
}

