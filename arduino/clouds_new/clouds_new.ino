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
#include <vector>
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <bluefruit.h>

#include "cz_blue.h"
#include "e_commands.h"
#include "d_neoPatterns.h"
#include "f_helpers.h"

// BLE Service
// BLEDis  bledis;
// BLEUart bleuart;

boolean firstConact = true; // TODO: set to false when dynamic input for clouds
void CloudComplete();
void getClouds();
std::vector<NeoPatterns> Clouds(4);
NeoPatterns Ring1(24, 16, NEO_GRB + NEO_KHZ800, &CloudComplete);
NeoPatterns Ring2(24, 30, NEO_GRB + NEO_KHZ800, &CloudComplete);
NeoPatterns Ring3(24, 15, NEO_GRB + NEO_KHZ800, &CloudComplete);
NeoPatterns Ring4(24, 27, NEO_GRB + NEO_KHZ800, &CloudComplete);

int loopTimer = 0;


/* EXAMPLES FOR SOME PATTERNS */
// Ring1.begin();
// Ring1.RainbowCycle(5);
// Ring1.TheaterChase(Ring1.Color(255,255,0), Ring1.Color(0,0,50), 300);

void setup() {
  // // test();
  Serial.begin(115200);
  Serial.println("Welcome into the mind of Jeanne's Clouds");
  Serial.println("--------------------------------");
  Serial.println("Please connect using Jeanne's awesome app");

  // initialize the clouds
  // NeoPatterns Ring1(24, 16, NEO_GRB + NEO_KHZ800, &CloudComplete);
  // NeoPatterns Ring2(24, 30, NEO_GRB + NEO_KHZ800, &CloudComplete);
  // NeoPatterns Ring3(24, 15, NEO_GRB + NEO_KHZ800, &CloudComplete);
  // NeoPatterns Ring4(24, 27, NEO_GRB + NEO_KHZ800, &CloudComplete);
  Clouds[0] = Ring1;
  Clouds[1] = Ring2;
  Clouds[2] = Ring3;
  Clouds[3] = Ring4;
  for(int i = 0; i < Clouds.size(); i++) {
    NeoPatterns& tmp = Clouds.at(i);
    tmp.begin();
    tmp.setBrightness(120);
    // tmp.RainbowCycle(5);
    tmp.TheaterChase(tmp.Wheel(random(255)), tmp.Wheel(random(255)), 50);
    tmp.Color1 = tmp.Color1;
  }

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


void loop() {
  // Loop printout
  loopTimer += 1;
  if(loopTimer % 20000 == 0) {
    // Serial.println("----- In Loop Cycle -----");
    // Serial.println(Clouds.size());
    loopTimer = 0;
  }

  // Update cycle
  for(int i = 0; i < Clouds.size(); i++) {
    if(loopTimer % 2000000 == 0) {
      Serial.println("ActPat");
      Serial.println(i);
      Serial.println(Clouds[i].ActivePattern);
    }
    Clouds[i].Update();
  }

  if ( Bluefruit.connected() ) {
    if(loopTimer % 200000 == 0) {
      // Serial.println("----- In BLE Cycle -----");
      // Serial.println(Clouds.size());
    }
    int command = bleuart.read();

    switch (command) {
      case 'A': { // Rainbow Cycle
        int cloudNum = bleuart.read();
        int interval = bleuart.read();
        Serial.println("----- In Rainbow Cycle -----");
        Serial.println(command);
        Serial.println(cloudNum);
        Serial.println(interval);

        NeoPatterns curCloud = Clouds[cloudNum];
        curCloud.ActivePattern = NeoPatterns::pattern::RAINBOW_CYCLE;
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

        curCloud.ActivePattern = NeoPatterns::pattern::THEATER_CHASE;
        curCloud.Color1 = curCloud.Wheel(random(255));
        curCloud.TheaterChase(curCloud.Wheel(random(255)), curCloud.Wheel(random(255)), interval);
        
        break;
      }
      case 'D': { // Color Wipe
        int cloudNum = bleuart.read();
        int interval = bleuart.read();
        int rCol = bleuart.read();
        int gCol = bleuart.read();
        int bCol = bleuart.read();

        Serial.println("----- In Color Wipe -----");
        Serial.println(command);
        Serial.println(cloudNum);
        Serial.println(interval);
        Serial.println(rCol);
        Serial.println(gCol);
        Serial.println(bCol);

        NeoPatterns& curCloud = Clouds[cloudNum];

        curCloud.ActivePattern = NeoPatterns::pattern::NONE;
        Serial.println("-- after color wipe cur cloud");
        Serial.println(curCloud.numPixels());


        for(int i = 0;  i < curCloud.numPixels(); i++) {
          curCloud.setPixelColor(i, rCol, gCol, bCol);
        }
        curCloud.show();

        // Refresh pixels
        swapBuffers(curCloud);
        
        // curCloud.ActivePattern = NeoPatterns::pattern::COLOR_WIPE;
        // curCloud.TotalSteps = curCloud.numPixels();
        // curCloud.Interval = interval;
        // curCloud.Color1 = curCloud.Wheel(random(255));
        
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

        curCloud.ActivePattern = NeoPatterns::pattern::SCANNER;
        curCloud.Scanner(curCloud.Wheel(random(255)), interval);
        
        break;
      }
      case 'F': { // Fade
        int cloudNum = bleuart.read();
        NeoPatterns curCloud = Clouds[cloudNum];

        Serial.println("----- In Fade -----");
        Serial.println(command);
        Serial.println(cloudNum);

        int interval = bleuart.read();
        curCloud.ActivePattern = NeoPatterns::pattern::FADE;
        curCloud.Fade(curCloud.Wheel(random(255)), curCloud.Wheel(random(255)), random(curCloud.numPixels()), interval, NeoPatterns::direction::FORWARD);
        
        break;
      }
      case 'Y': { // Turn On
        int cloudNum = bleuart.read();
        NeoPatterns curCloud = Clouds[cloudNum];
        curCloud.ActivePattern = NeoPatterns::pattern::COLOR_WIPE;
        curCloud.TotalSteps = curCloud.numPixels();
        curCloud.Interval = 100;
        curCloud.Color1 = curCloud.Wheel(random(255));
      }
      case 'Z': { // Turn Off
        int cloudNum = bleuart.read();
        NeoPatterns curCloud = Clouds[cloudNum];
        curCloud.ActivePattern = NeoPatterns::pattern::COLOR_WIPE;
        curCloud.TotalSteps = curCloud.numPixels();
        curCloud.Interval = 10;
        curCloud.Color1 = curCloud.Wheel(0);
      }
      default: {
        // Serial.println("--- In Default ---");
        // Serial.println(command);
      }
    } // end of switch case
  } // end of ble read
} // end of loop

// Ring1 Completion Callback
void CloudComplete()
{
  // TODO: figure out how to have a parameter for a callback func
  // curCloud.Reverse();
  // Serial.println("---TRIED TO USE CALLBACK FUNCTION---");
}

void getClouds() {
  int numClouds = bleuart.read(); // read how many clouds we have
  firstConact = true;

  for(int i = 0; i < numClouds; i++) {
    NeoPatterns tmpCloud(24, 16, NEO_GRB + NEO_KHZ800, &CloudComplete);
    Clouds.push_back(tmpCloud);
  }
}
