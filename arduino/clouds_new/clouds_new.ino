/*********************************************************************
 This is the controller for Jeanne's Clouds!

 It works in conjunction with her personal Android App so she can set
 colors and patterns on her clouds in any way she wants. 

 Love you Jeanne!  

 .;;;, .;;;,                   .;;;, .;;;,
       .;;;,;;;;;,;;;;;,.;;;,       .;;;.,;;;;;,;;;;;,;;;.
      ;;;;oOOoOOoOOoOOoOOo;;;. .,. .;;;oOOoOOoOOoOOoOOo;;;;
  .,,.`oOOo'           `OoOOo,;;;;;,oOOoO'          `oOOo;',,.
 ;;;;oOOo'    ,;;;,       `OoOOo;oOOoO'       ,;;;,   `oOOo;;;;
 `;;OOoO'    ;;;'             `OOO'             `;;;   `OoOO;;'
,;;,OOoO     ;;                 "                 ;;    OoOO,;;,
;;;;OOoO     `;     ,;;.                          ;'    OoOO;;;;
 ``.;OOoO,    `;    ` ;;    .;;. ;; ;; .;;,      ;'   ,OoOO;,''
   ;;;;OOoO,          ;;    ;  ; `; ;' ;..'         ,OoOO;;;;
    ```.;OOoO,        ;,;;, `;;'  `;'  `;;'       ,OoOO;,'''
       ;;;;OOoO,      '    ',  ,                ,OoOO;;;;
        ```,;OOoO,.          ''              .,OoOO;,'''
            ;;;;OOoO,.                    .,OoOO;;;;
             ````,;OOoO,.              .,OoOO;, '''
                 ;;;;;OOoO,.        .,OoOO;;;;
                  `````,;OOoO,.  .,OoOO;,''''
                       ;;;;;OOoOOoOO;;;;; 
                        `````;;OO;;'''''
                             `;;;;'
                             
*********************************************************************/
// This sketch is intended to be used with Jeanne's App
//
// - Compile and flash this sketch to the nRF52 Feather
// - Open Jeanne's app
// - Scan for "Jeanne's Clouds" 
// - Click the 'connect' button to establish a connection and
//   send the meta-data about the pixel layout
// - Use the application to control the clouds

/* NOTE: This sketch required at least version 1.1.0 of Adafruit_Neopixel !!! */
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <bluefruit.h>
// #include <vector>

#include "cz_blue.h"
#include "e_commands.h"
#include"d_neoPatterns.h"

// BLE Service
// BLEDis  bledis;
// BLEUart bleuart;

boolean firstConact = false;
void CloudComplete();
void getClouds();
NeoPatterns Clouds[1];



void setup() {
  // // test();
  Serial.begin(115200);
  Serial.println("Welcome into the mind of Jeanne's Clouds");
  Serial.println("--------------------------------");
  Serial.println();
  Serial.println("Please connect using Jeanne's awesome app");

  // // Initialize all the pixelStrips
  // Ring1.begin();

  // Ring1.setBrightness(120);
  
  // // Kick off patterns
  // //  Ring1.RainbowCycle(5);
  // //  Ring1.TheaterChase(Ring1.Color(255,255,0), Ring1.Color(0,0,50), 300);
  // Ring1.RainbowCycle(5);

  // // Init Bluefruit
  Bluefruit.begin();
  // Set max power. Accepted values are: -40, -30, -20, -16, -12, -8, -4, 0, 4
  Bluefruit.setTxPower(4);
  Bluefruit.setName("Clouds");
  Bluefruit.setConnectCallback(connect_callback);

  // Configure and Start Device Information Service
  bledis.setManufacturer("Adafruit Industries");
  bledis.setModel("Bluefruit Feather52");
  bledis.begin();  

  // Configure and start BLE UART service
  bleuart.begin();

  // Set up and start advertising
  startAdv();
}


void loop() {

    if ( Bluefruit.connected() ) {
      int command = bleuart.read();

      if(!firstConact && command == 'X') {
        Clouds = getClouds();
      }
      // Update the cluds.
      // for(NeoPatterns cloud : Clouds) {
      //   cloud.Update()
      // }
    
      switch (command) {
        case 'A': { // Rainbow Cycle
          int cloudNum = bleuart.read();
          int interval = bleuart.read();
          Serial.println("----- In Rainbow Cycle -----");
          Serial.println(command);
          Serial.println(cloudNum);
          Serial.println(interval);

          NeoPatterns curCloud = Clouds[cloudNum];
          curCloud.ActivePattern = RAINBOW_CYCLE;
          curCloud.Interval = interval;
          curCloud.TotalSteps = 255;
          curCloud.Color1 = curCloud.Wheel(random(255));
          
          break;
        }
        case 'B': {   // Set Brightness
          int cloudNum = bleuart.read();
          int bVal = bleuart.read();
          NeoPatterns curCloud = Clouds[cloudNum];
          commandSetBrightness(bVal, curCloud);
          break;
        }      
        case 'C': { // Theater Chase
          int cloudNum = bleuart.read();
          int interval = bleuart.read();
          NeoPatterns curCloud = Clouds[cloudNum];
          Serial.println("----- In Theater Chase -----");
          Serial.println(command);
          Serial.println(cloudNum);
          Serial.println(interval);

          curCloud.ActivePattern = THEATER_CHASE;
          curCloud.Color1 = Ring1.Wheel(random(255));
          curCloud.TheaterChase(curCloud.Wheel(random(255)), curCloud.Wheel(random(255)), interval);
          
          break;
        }
        case 'D': { // Color Wipe
          int cloudNum = bleuart.read();
          int interval = bleuart.read();
          NeoPatterns curCloud = Clouds[cloudNum];
          Serial.println("----- In Color Wipe -----");
          Serial.println(command);
          Serial.println(cloudNum);
          Serial.println(interval);

          curCloud.ActivePattern = COLOR_WIPE;
          curCloud.TotalSteps = Ring1.numPixels();
          curCloud.Interval = interval;
          curCloud.Color1 = curCloud.Wheel(random(255));
          
          break;
        }
        case 'E': { // Scanner
          int cloudNum = bleuart.read();
          int interval = bleuart.read();
          NeoPatterns curCloud = Clouds[cloudNum];

          Serial.println("----- In Scanner -----");
          Serial.println(command);
          Serial.println(cloudNum);
          Serial.println(interval);

          curCloud.ActivePattern = SCANNER;
          curCloud.Scanner(curCloud.Wheel(random(255)), interval);
          
          break;
        }
        case 'F': { // Fade
          NeoPatterns curCloud = Clouds[cloudNum];
          int cloudNum = bleuart.read();

          Serial.println("----- In Fade -----");
          Serial.println(command);
          Serial.println(cloudNum);
          Serial.println(interval);

          int interval = bleuart.read();
          curCloud.ActivePattern = FADE;
          curCloud.Fade(curCloud.Wheel(random(255)), curCloud.Wheel(random(255)), random(curCloud.numPixels()), interval, FORWARD);
          
          break;
        }
        case 'Y': { // Turn On
          int cloudNum = bleuart.read();
          NeoPatterns curCloud = Clouds[cloudNum];
          curCloud.ActivePattern = COLOR_WIPE;
          curCloud.TotalSteps = curCloud.numPixels();
          curCloud.Interval = 100;
          curCloud.Color1 = curCloud.Wheel(random(255));
        }
        case 'Z': { // Turn Off
        int cloudNum = bleuart.read();
          NeoPatterns curCloud = Clouds[cloudNum];
          curCloud.ActivePattern = COLOR_WIPE;
          curCloud.TotalSteps = Ring1.numPixels();
          curCloud.Interval = 10;
          curCloud.Color1 = Ring1.Wheel(0);
        }
      }


 
  }
}

// Ring1 Completion Callback
void CloudComplete()
{
  // TODO: figure out how to have a parameter for a callback func
  // curCloud.Reverse();
  Serial.println("---TRIED TO USE CALLBACK FUNCTION---")
}

void startAdv(void)
{  
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  
  // Include bleuart 128-bit uuid
  Bluefruit.Advertising.addService(bleuart);

  // Secondary Scan Response packet (optional)
  // Since there is no room for 'Name' in Advertising packet
  Bluefruit.ScanResponse.addName();
  
  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}

void connect_callback(uint16_t conn_handle)
{
  char central_name[32] = { 0 };
  Bluefruit.Gap.getPeerName(conn_handle, central_name, sizeof(central_name));

  Serial.print("Connected to ");
  Serial.println(central_name);

//  Serial.println("Please select the 'Neopixels' tab, click 'Connect' and have fun");
  Serial.println("Please select a cloud pattern and enjoy");
}

NeoPatterns[] getClouds() {
  int numClouds = bleuart.read(); // read how many clouds we have
  firstConact = true;

  for(int i = 0; i < numClouds; i++) {
    NeoPatterns tmpCloud(24, 16, NEO_GRB + NEO_KHZ800, &CloudComplete;
    Clouds.append(tmpCloud);
  }
}