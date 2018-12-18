import { Component, OnInit, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { DeviceService } from '../../modules/shared/services/device.service';
import { PatternsService } from '../../modules/shared/services/patterns.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PatternsEnum } from '../../modules/shared/models/patterns.model';

interface CloudCircle {
  coordX: number,
  coordY: number,
  radius: number
}

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.page.html',
  styleUrls: ['./clouds.page.scss'],
})
export class CloudsPage implements OnInit, OnDestroy {
  // @ViewChild('my_svg') mySvg: ElementRef;
  Cloud1: Array<CloudCircle> = new Array<CloudCircle>();
  cloudHeight:number;
  cloudWidth: number;
  serviceDevice;
  connected = false;

  displayMsg;
  notifMsg;
  otherInfo;

  showPickers = false;
  showPerp = false;

  peripheral: any = {};
  red: number;
  green: number;
  blue: number;
  brightness: number;
  power: boolean;

  peripheralInfo;
  piServices;
  piCharacs;

  constructor(private ble: BLE,
              private ngZone: NgZone
              , private deviceService: DeviceService
              , private router: Router
              , private actRoute: ActivatedRoute
              , private patternService: PatternsService) {

  }

  ngOnInit() {
    this.ngZone.run(() => {
      // this.displayMsg = "Trying to connect to " + this.deviceService.selectedDevice.name;
      // this.serviceDevice = JSON.stringify(this.deviceService.selectedDevice);

      // this.ble.connect(this.deviceService.selectedDevice.id).subscribe(
      //   peripheral => this.onConnected(peripheral),
      //   peripheral => this.onDeviceDisconnected(peripheral)
      // )

      this.cloudWidth = window.innerWidth;
      this.cloudHeight = window.innerHeight / 2;

      var cx = (window.innerWidth / 2)
      var cy = window.innerHeight / 4
      this.drawClouds(cx, cy, 120, 90);


    })
  }


  ngOnDestroy() {
    console.log('destroying disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.connected = true;
      this.deviceService.setPeripheral(peripheral);
      this.displayMsg = 'Connected to: ' + peripheral.name + ' ' + peripheral.id;

      this.otherInfo = "service: " + this.deviceService.serviceCloud1 + "tx: " + this.deviceService.txCloud1;

      this.ble.startNotification(peripheral.id, this.deviceService.serviceCloud1, this.deviceService.rxCloud1).subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          console.log('Received Notification: Power Switch = ' + data);
          this.ngZone.run(() => {
            this.displayMsg = "started notifs";
            this.power = data[0] !== 0;
          });
        }
      );
    });
  }

  onDeviceDisconnected(peripheral) {
    // let toast = this.toastCtrl.create({
    //   message: 'The peripheral unexpectedly disconnected',
    //   duration: 3000,
    //   position: 'center'
    // });

    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    //   // TODO navigate back?
    // });

    // toast.present();
  }

  setColor(event){
    // this.ngZone.run(() => {
    //   this.displayMsg = 'Setting Color'; 
    //   let data = new Uint8Array([this.red, this.green, this.blue]);

    //   this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
    //     (info) => {
    //       console.log('Updated color')
    //       this.displayMsg = 'Updated color' + info; 
    //     },
    //     (err) => {
    //       this.displayMsg = 'Error updating color' + err; 
    //       console.log('Error updating color')
    //     }
    //   );
    // })
  }

  setBrightness(event){
    // this.ngZone.run(() => {
    //   let data = new Uint8Array([this.brightness]);
    //   this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
    //     (info) => {
    //       this.displayMsg = 'Updated brightness' + info; 
    //       console.log('Updated brightness')
    //     },
    //     (err) => {
    //       this.displayMsg = 'Error updating brightness' + err; 
    //       console.log('Error updating brightness')
    //     }
    //   );
    // })
  }

  onPowerSwitchChange(event) {
    // this.ngZone.run(() => {
    //   let value = this.power ? 1 : 0;
    //   let data = new Uint8Array([value]);
    //   this.displayMsg = 'Power Switch Property ' + this.power;
    //   console.log('Power Switch Property ' + this.power);

    //   this.ble.write(this.peripheral.id, this.NEOPIXEL_SERVICE, this.NEOPIXEL_TX, data.buffer as ArrayBuffer).then(
    //     (msg) => {
    //       console.log('Updated power switch')
    //       this.displayMsg = "Updated Power switch " + msg
    //       if (this.power && this.brightness === 0) {
    //         this.brightness = 0x3f; // cheating, should rely on notification
    //       }
    //     },
    //     (err) => {
    //       this.displayMsg = "Error updating power switch: " + err
    //       console.log('Error updating  power switch')
    //     }
    //   );
    // })
  }

  drawClouds(cx, cy, r1, r2) {
    this.ngZone.run(() => {
      //  The center is the same for all circles
      // var cx = window.innerWidth / 3
      // var cy = window.innerHeight / 3

      var radius_of_satellites_from_center = [r1, r2]
      var radius_of_small_circles = 10
      var number_of_satellite_circles = 16

      for(var r in radius_of_satellites_from_center){
        console.log('rrr', r)
        //  The angle increments for each circle drawn
        for(var n=0; n<number_of_satellite_circles; n++){
                
          //  Find how many degrees separate each circle
          var degrees_of_separation = 360/number_of_satellite_circles
          var angle_as_degrees = degrees_of_separation * n
          var coordinates = this.polarToCartesian(cx, cy, radius_of_satellites_from_center[r], angle_as_degrees)

          let cc: CloudCircle = {
            coordX: coordinates.x,
            coordY: coordinates.y,
            radius: radius_of_small_circles
          };
          this.Cloud1.push(cc);
          // document.getElementById('my_svg').appendChild( this.drawCircle(coordinates.x,coordinates.y,radius_of_small_circles) )
        }
      }
      
    })

    console.log(this.Cloud1);
  }

  drawCircle(cx,cy,r){
    var svgCircle = document.createElementNS('http://www.w3.org/2000/svg',"circle");
        svgCircle.setAttributeNS(null,"cx", cx);
        svgCircle.setAttributeNS(null,"cy", cy);
        svgCircle.setAttributeNS(null,"r", r);
        svgCircle.setAttributeNS(null,"stroke",'blue')
        svgCircle.setAttributeNS(null,"fill",'transparent')
    return svgCircle;
  }

  polarToCartesian(center_x, center_y, radius, angle_in_degrees) {
    var return_value: any = {}
    var angle_in_radians =  angle_in_degrees * Math.PI / 180.0;
        return_value.x =    center_x + radius * Math.cos(angle_in_radians);
        return_value.y =    center_y + radius * Math.sin(angle_in_radians);
    return return_value;
  }

  determineColor(index:number) {
    return "red";
  }

  changeColor(index: number) {
    console.log('changing', index)

  }

  
}
