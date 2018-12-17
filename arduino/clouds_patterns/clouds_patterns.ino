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

#define NEOPIXEL_VERSION_STRING "Neopixel v2.0"
#define PIN11                    11   /* Pin used for Cloud 1 */
#define PIN16                    16  /* Pin used for Cloud 2 */
#define PIN27                    27  /* Pin used for Cloud 3 */

#define MAXCOMPONENTS  4
uint8_t *pixelBuffer = NULL;
uint8_t width = 0;
uint8_t height = 0;
uint8_t stride;
uint8_t componentsValue;
bool is400Hz;
uint8_t components = 3;     // only 3 and 4 are valid values

//Adafruit_NeoPixel Cloud_1 = Adafruit_NeoPixel(16, PIN11, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel Cloud_2 = Adafruit_NeoPixel(16, PIN16, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel Cloud_3 = Adafruit_NeoPixel(16, PIN27, NEO_GRB + NEO_KHZ800);

// BLE Service
BLEDis  bledis;
BLEUart bleuart;

void setup()
{
  Serial.begin(115200);
  Serial.println("Adafruit Bluefruit Neopixel Test");
  Serial.println("--------------------------------");

  Serial.println();
  Serial.println("Please connect using the Bluefruit Connect LE application");
  
  // Config Neopixels
//  Cloud_1.begin();
  Cloud_2.begin();
  Cloud_3.begin();

  // Init Bluefruit
  Bluefruit.begin();
  // Set max power. Accepted values are: -40, -30, -20, -16, -12, -8, -4, 0, 4
  Bluefruit.setTxPower(4);
  Bluefruit.setName("Bluefruit52");
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

  Serial.println("Please select the 'Neopixels' tab, click 'Connect' and have fun");
}

void loop()
{
  // Echo received data
  // if ( Bluefruit.connected() && bleuart.notifyEnabled() )
  if ( Bluefruit.connected() )
  {
    int command = bleuart.read();

    switch (command) {
      case 'A': { // test
        commandSendA();
        break;
      }

      case 'Q': { // test
//        commandSendQ(200, Cloud_1);
        commandSendQ(200, Cloud_2);
        commandSendQ(200, Cloud_3);
        break;
      }

      case 'X': {
        commandSendX();
        break;
      }

      case 'Z': { // nother test
        commandSendZ();
        break;
      }
      
      case 'V': {   // Get Version
          commandVersion();
          break;
        }
  
      case 'S': {   // Setup dimensions, components, stride...
//          commandSetup();
          break;
       }

      case 'C': {   // Clear with color
//          commandClearColor(Cloud_1);
          commandClearColor(Cloud_2);
          commandClearColor(Cloud_3);
          break;
      }

      case 'B': {   // Set Brightness
//          commandSetBrightness(Cloud_1);
          commandSetBrightness(Cloud_2);
          commandSetBrightness(Cloud_3);
          break;
      }
            
      case 'P': {   // Set Pixel
//          commandSetPixel(Cloud_1);
          commandSetPixel(Cloud_2);
          commandSetPixel(Cloud_3);
          break;
      }
  

    }
  }
}

void swapBuffers(Adafruit_NeoPixel cur_cloud)
{
  uint8_t *base_addr = pixelBuffer;
  int pixelIndex = 0;
  for (int j = 0; j < height; j++)
  {
    for (int i = 0; i < width; i++) {
      if (components == 3) {
        cur_cloud.setPixelColor(pixelIndex, cur_cloud.Color(*base_addr, *(base_addr+1), *(base_addr+2)));
      }
      else {
        cur_cloud.setPixelColor(pixelIndex, cur_cloud.Color(*base_addr, *(base_addr+1), *(base_addr+2), *(base_addr+3) ));
      }
      base_addr += components;
      pixelIndex++;
    }
    pixelIndex += stride - width;   // Move pixelIndex to the next row (take into account the stride)
  }
  cur_cloud.show();

}

void commandVersion() {
  Serial.println(F("Command: Version check"));
  sendResponse(NEOPIXEL_VERSION_STRING);
}

void commandSetBrightness(Adafruit_NeoPixel cur_cloud) {
  Serial.println(F("Command: SetBrightness"));

   // Read value
  uint8_t brightness = bleuart.read();

  // Set brightness
  cur_cloud.setBrightness(brightness);

  // Refresh pixels
  swapBuffers(cur_cloud);

  // Done
  sendResponse("OK");
}

void commandClearColor(Adafruit_NeoPixel cur_cloud) {
  Serial.println(F("Command: ClearColor"));

  // Read color
  uint8_t color[MAXCOMPONENTS];
  for (int j = 0; j < components;) {
    if (bleuart.available()) {
      color[j] = bleuart.read();
      j++;
    }
  }

  // Set all leds to color
  int size = width * height;
  uint8_t *base_addr = pixelBuffer;
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < components; j++) {
      *base_addr = color[j];
      base_addr++;
    }
  }

  // Swap buffers
  Serial.println(F("ClearColor completed"));
  swapBuffers(cur_cloud);


  if (components == 3) {
    Serial.printf("\tclear (%d, %d, %d)\n", color[0], color[1], color[2] );
  }
  else {
    Serial.printf("\tclear (%d, %d, %d, %d)\n", color[0], color[1], color[2], color[3] );
  }
  
  // Done
  sendResponse("OK");
}

void commandSetPixel(Adafruit_NeoPixel cur_cloud) {
  Serial.println(F("Command: SetPixel"));

  // Read position
  uint8_t x = bleuart.read();
  uint8_t y = bleuart.read();

  // Read colors
  uint32_t pixelOffset = y*width+x;
  uint32_t pixelDataOffset = pixelOffset*components;
  uint8_t *base_addr = pixelBuffer+pixelDataOffset;
  for (int j = 0; j < components;) {
    if (bleuart.available()) {
      *base_addr = bleuart.read();
      base_addr++;
      j++;
    }
  }

  // Set colors
  uint32_t neopixelIndex = y*stride+x;
  uint8_t *pixelBufferPointer = pixelBuffer + pixelDataOffset;
  uint32_t color;
  if (components == 3) {
    color = cur_cloud.Color( *pixelBufferPointer, *(pixelBufferPointer+1), *(pixelBufferPointer+2) );
    Serial.printf("\tcolor (%d, %d, %d)\n",*pixelBufferPointer, *(pixelBufferPointer+1), *(pixelBufferPointer+2) );
  }
  else {
    color = cur_cloud.Color( *pixelBufferPointer, *(pixelBufferPointer+1), *(pixelBufferPointer+2), *(pixelBufferPointer+3) );
    Serial.printf("\tcolor (%d, %d, %d, %d)\n", *pixelBufferPointer, *(pixelBufferPointer+1), *(pixelBufferPointer+2), *(pixelBufferPointer+3) );    
  }
  cur_cloud.setPixelColor(neopixelIndex, color);
  cur_cloud.show();

  // Done
  sendResponse("OK");
}

void sendResponse(char const *response) {
    Serial.printf("Send Response: %s\n", response);
    bleuart.write(response, strlen(response)*sizeof(char));
}

/*********************************************************************
 *  This file defines the different patterns possible for the clouds
 * 
*********************************************************************/

bool is_looping = false; // Are we currently looping a pattern?
unsigned long previousMillis = millis();

void commandSendA() {
  Serial.println("----------------------------------------");
  Serial.println("IN A mothaFUCKA!!!!!");

//  colorWipe(Cloud_1, Cloud_1.Color(0, 255, 0), 50); // Green
  colorWipe(Cloud_2, Cloud_2.Color(0, 255, 0), 50); // Green
  colorWipe(Cloud_3, Cloud_3.Color(255, 0, 0), 50); // Red

  Serial.println("----------------------------------------");
  Serial.println("IN A mothaFUCKA, aFter 1!!!!!");

//  colorWipe(Cloud_1, Cloud_1.Color(255, 0, 0), 50); // Green
  colorWipe(Cloud_2, Cloud_2.Color(255, 0, 0), 50); // Red
  colorWipe(Cloud_3, Cloud_3.Color(0, 0, 255), 50); // Blue

  Serial.println("----------------------------------------");
  Serial.println("IN A mothaFUCKA, aFter 2!!!!!");

  colorWipe(Cloud_2, Cloud_2.Color(0, 0, 255), 50); // Blue
  colorWipe(Cloud_3, Cloud_3.Color(0, 255, 0), 50); // Green

//  colorWipe(Cloud_1, Cloud_1.Color(255, 0, 0), 50); // Red
//  colorWipe(Cloud_1, Cloud_1.Color(0, 255, 0), 50); // Green
//  colorWipe(Cloud_1, Cloud_1.Color(0, 0, 255), 50); // Blue

//  colorWipe(Cloud_2, Cloud_2.Color(255, 0, 0), 50); // Red
//  colorWipe(Cloud_2, Cloud_2.Color(0, 255, 0), 50); // Green
//  colorWipe(Cloud_2, Cloud_2.Color(0, 0, 255), 50); // Blue
//
//  colorWipe(Cloud_3, Cloud_3.Color(255, 0, 0), 50); // Red
//  colorWipe(Cloud_3, Cloud_3.Color(0, 255, 0), 50); // Green
//  colorWipe(Cloud_3, Cloud_3.Color(0, 0, 255), 50); // Blue
}

void commandSendQ(uint8_t interval, Adafruit_NeoPixel cur_cloud) {
  Serial.println("----------------------------------------");
  Serial.println("IN Q mothaFUCKA!!!!!");
  
  unsigned long currentMillis = millis();
  is_looping = true;
  currentMillis = millis();
  while(is_looping) {
    previousMillis = currentMillis;
    if (currentMillis - previousMillis >= interval) {
      for(uint16_t i=0; i<cur_cloud.numPixels(); i++) {
        cur_cloud.setPixelColor(i, cur_cloud.Color(251, 0, 0));
        cur_cloud.show();
      }
    }
    is_looping = false;
  }
}

void commandSendX() {
  Serial.println("----------------------------------------");
  Serial.println("IN X mothaFUCKA!!!!!");

//  rainbowCycleDelay(20, Cloud_1);
  rainbowCycleDelay(20, Cloud_2);
  rainbowCycleDelay(20, Cloud_3);
}

void commandSendZ() {
  Serial.println("----------------------------------------");
  Serial.println("IN Z mothaFUCKA!!!!!");

//  rainbowCycleLoop(20, Cloud_1);
  rainbowCycleLoop(20, Cloud_2);
  rainbowCycleLoop(20, Cloud_3);
}


// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return Cloud_3.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return Cloud_3.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return Cloud_3.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

// Fill the dots one after the other with a color
void colorWipe(Adafruit_NeoPixel cur_cloud, uint32_t c, uint8_t wait) {  
  Serial.println("Beg of wipe");

  for(uint16_t i=0; i < cur_cloud.numPixels(); i++) {
    cur_cloud.setPixelColor(i, c);
    cur_cloud.show();
    delay(wait);
  }

  Serial.println("End of wipe");
}

void rainbow(uint8_t wait, Adafruit_NeoPixel cur_cloud) {
  uint16_t i, j;

  for(j=0; j < 256; j++) {
    for(i=0; i < cur_cloud.numPixels(); i++) {
      cur_cloud.setPixelColor(i, Wheel((i+j) & 255));
    }
    cur_cloud.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycleDelay(uint8_t wait, Adafruit_NeoPixel cur_cloud) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< cur_cloud.numPixels(); i++) {
      cur_cloud.setPixelColor(i, Wheel(((i * 256 / cur_cloud.numPixels()) + j) & 255));
    }
    cur_cloud.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycleLoop(uint8_t interval, Adafruit_NeoPixel cur_cloud) {
  uint16_t i, j;
  unsigned long currentMillis = millis();
  
  is_looping = true;
  while(is_looping) {
    currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

      for(j=0; j < 256*5; j++) { // 5 cycles of all colors on wheel
        for(i=0; i < cur_cloud.numPixels(); i++) {
          cur_cloud.setPixelColor(i, Wheel(((i * 256 / cur_cloud.numPixels()) + j) & 255));
        }
        cur_cloud.show();
//        delay(wait);
      }
    }
    is_looping = false;
  }
}


//Theatre-style crawling lights.
void theaterChase(uint32_t c, uint8_t wait, Adafruit_NeoPixel cur_cloud) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (uint16_t i=0; i < cur_cloud.numPixels(); i=i+3) {
        cur_cloud.setPixelColor(i+q, c);    //turn every third pixel on
      }
      cur_cloud.show();

      delay(wait);

      for (uint16_t i=0; i < cur_cloud.numPixels(); i=i+3) {
        cur_cloud.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

//Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(uint8_t wait, Adafruit_NeoPixel cur_cloud) {
  for (int j=0; j < 256; j++) {     // cycle all 256 colors in the wheel
    for (int q=0; q < 3; q++) {
      for (uint16_t i=0; i < cur_cloud.numPixels(); i=i+3) {
        cur_cloud.setPixelColor(i+q, Wheel( (i+j) % 255));    //turn every third pixel on
      }
      cur_cloud.show();

      delay(wait);

      for (uint16_t i=0; i < cur_cloud.numPixels(); i=i+3) {
        cur_cloud.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}
