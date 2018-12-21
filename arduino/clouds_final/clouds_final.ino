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

// BLE Service
BLEDis  bledis;
BLEUart bleuart;

#define MAXCOMPONENTS  4
uint8_t *pixelBuffer = NULL;
uint8_t width = 0;
uint8_t height = 0;
uint8_t stride;
uint8_t componentsValue;
bool is400Hz;
uint8_t components = 3;     // only 3 and 4 are valid values

// Pattern types supported:
enum  pattern { NONE, RAINBOW_CYCLE, THEATER_CHASE, COLOR_WIPE, SCANNER, FADE };
// Patern directions supported:
enum  direction { FORWARD, REVERSE };

// NeoPattern Class - derived from the Adafruit_NeoPixel class
class NeoPatterns : public Adafruit_NeoPixel
{
    public:

    // Member Variables:  
    pattern  ActivePattern;  // which pattern is running
    direction Direction;     // direction to run the pattern
    
    unsigned long Interval;   // milliseconds between updates
    unsigned long lastUpdate; // last update of position
    
    uint32_t Color1, Color2;  // What colors are in use
    uint16_t TotalSteps;  // total number of steps in the pattern
    uint16_t Index;  // current step within the pattern
    
    void (*OnComplete)();  // Callback on completion of pattern
    
    // Constructor - calls base-class constructor to initialize strip
    NeoPatterns(uint16_t pixels, uint8_t pin, uint8_t type, void (*callback)())
    :Adafruit_NeoPixel(pixels, pin, type)
    {
        OnComplete = callback;
    }
    
    // Update the pattern
    void Update()
    {
        if((millis() - lastUpdate) > Interval) // time to update
        {
            lastUpdate = millis();
            switch(ActivePattern)
            {
                case RAINBOW_CYCLE:
                    RainbowCycleUpdate();
                    break;
                case THEATER_CHASE:
                    TheaterChaseUpdate();
                    break;
                case COLOR_WIPE:
                    ColorWipeUpdate();
                    break;
                case SCANNER:
                    ScannerUpdate();
                    break;
                case FADE:
                    FadeUpdate();
                    break;
                default:
                    break;
            }
        }
    }
  
    // Increment the Index and reset at the end
    void Increment()
    {
        if (Direction == FORWARD)
        {
           Index++;
           if (Index >= TotalSteps)
            {
                Index = 0;
                if (OnComplete != NULL)
                {
                    OnComplete(); // call the comlpetion callback
                }
            }
        }
        else // Direction == REVERSE
        {
            --Index;
            if (Index <= 0)
            {
                Index = TotalSteps-1;
                if (OnComplete != NULL)
                {
                    OnComplete(); // call the comlpetion callback
                }
            }
        }
    }
    
    // Reverse pattern direction
    void Reverse()
    {
        if (Direction == FORWARD)
        {
            Direction = REVERSE;
            Index = TotalSteps-1;
        }
        else
        {
            Direction = FORWARD;
            Index = 0;
        }
    }
    
    // Initialize for a RainbowCycle
    void RainbowCycle(uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = RAINBOW_CYCLE;
        Interval = interval;
        TotalSteps = 255;
        Index = 0;
        Direction = dir;
    }
    
    // Update the Rainbow Cycle Pattern
    void RainbowCycleUpdate()
    {
        for(int i=0; i< numPixels(); i++)
        {
            setPixelColor(i, Wheel(((i * 256 / numPixels()) + Index) & 255));
        }
        show();
        Increment();
    }

    // Initialize for a Theater Chase
    void TheaterChase(uint32_t color1, uint32_t color2, uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = THEATER_CHASE;
        Interval = interval;
        TotalSteps = numPixels();
        Color1 = color1;
        Color2 = color2;
        Index = 0;
        Direction = dir;
   }
    
    // Update the Theater Chase Pattern
    void TheaterChaseUpdate()
    {
        for(int i=0; i< numPixels(); i++)
        {
            if ((i + Index) % 3 == 0)
            {
                setPixelColor(i, Color1);
            }
            else
            {
                setPixelColor(i, Color2);
            }
        }
        show();
        Increment();
    }

    // Initialize for a ColorWipe
    void ColorWipe(uint32_t color, uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = COLOR_WIPE;
        Interval = interval;
        TotalSteps = numPixels();
        Color1 = color;
        Index = 0;
        Direction = dir;
    }
    
    // Update the Color Wipe Pattern
    void ColorWipeUpdate()
    {
        setPixelColor(Index, Color1);
        show();
        Increment();
    }
    
    // Initialize for a SCANNNER
    void Scanner(uint32_t color1, uint8_t interval)
    {
        ActivePattern = SCANNER;
        Interval = interval;
        TotalSteps = (numPixels() - 1) * 2;
        Color1 = color1;
        Index = 0;
    }

    // Update the Scanner Pattern
    void ScannerUpdate()
    { 
        for (int i = 0; i < numPixels(); i++)
        {
            if (i == Index)  // Scan Pixel to the right
            {
                 setPixelColor(i, Color1);
            }
            else if (i == TotalSteps - Index) // Scan Pixel to the left
            {
                 setPixelColor(i, Color1);
            }
            else // Fading tail
            {
                 setPixelColor(i, DimColor(getPixelColor(i)));
            }
        }
        show();
        Increment();
    }
    
    // Initialize for a Fade
    void Fade(uint32_t color1, uint32_t color2, uint16_t steps, uint8_t interval, direction dir = FORWARD)
    {
        ActivePattern = FADE;
        Interval = interval;
        TotalSteps = steps;
        Color1 = color1;
        Color2 = color2;
        Index = 0;
        Direction = dir;
    }
    
    // Update the Fade Pattern
    void FadeUpdate()
    {
        // Calculate linear interpolation between Color1 and Color2
        // Optimise order of operations to minimize truncation error
        uint8_t red = ((Red(Color1) * (TotalSteps - Index)) + (Red(Color2) * Index)) / TotalSteps;
        uint8_t green = ((Green(Color1) * (TotalSteps - Index)) + (Green(Color2) * Index)) / TotalSteps;
        uint8_t blue = ((Blue(Color1) * (TotalSteps - Index)) + (Blue(Color2) * Index)) / TotalSteps;
        
        ColorSet(Color(red, green, blue));
        show();
        Increment();
    }
   
    // Calculate 50% dimmed version of a color (used by ScannerUpdate)
    uint32_t DimColor(uint32_t color)
    {
        // Shift R, G and B components one bit to the right
        uint32_t dimColor = Color(Red(color) >> 1, Green(color) >> 1, Blue(color) >> 1);
        return dimColor;
    }

    // Set all pixels to a color (synchronously)
    void ColorSet(uint32_t color)
    {
        for (int i = 0; i < numPixels(); i++)
        {
            setPixelColor(i, color);
        }
        show();
    }

    // Returns the Red component of a 32-bit color
    uint8_t Red(uint32_t color)
    {
        return (color >> 16) & 0xFF;
    }

    // Returns the Green component of a 32-bit color
    uint8_t Green(uint32_t color)
    {
        return (color >> 8) & 0xFF;
    }

    // Returns the Blue component of a 32-bit color
    uint8_t Blue(uint32_t color)
    {
        return color & 0xFF;
    }
    
    // Input a value 0 to 255 to get a color value.
    // The colours are a transition r - g - b - back to r.
    uint32_t Wheel(byte WheelPos)
    {
        WheelPos = 255 - WheelPos;
        if(WheelPos < 85)
        {
            return Color(255 - WheelPos * 3, 0, WheelPos * 3);
        }
        else if(WheelPos < 170)
        {
            WheelPos -= 85;
            return Color(0, WheelPos * 3, 255 - WheelPos * 3);
        }
        else
        {
            WheelPos -= 170;
            return Color(WheelPos * 3, 255 - WheelPos * 3, 0);
        }
    }
};

void Ring1Complete();
void Ring2Complete();
void Ring3Complete();
//void StickComplete();

// Define some NeoPatterns for the two rings and the stick
//  as well as some completion routines
NeoPatterns Ring1(12, 16, NEO_GRB + NEO_KHZ800, &Ring1Complete);
NeoPatterns Ring2(12, 27, NEO_GRB + NEO_KHZ800, &Ring2Complete);
NeoPatterns Ring3(12, 15, NEO_GRB + NEO_KHZ800, &Ring3Complete);


// Initialize everything and prepare to start
void setup()
{
  Serial.begin(115200);
  Serial.println("Welcome into the mind of Jeanne's Clouds");
  Serial.println("--------------------------------");
  Serial.println();
  Serial.println("Please connect using Jeanne's awesome app");

  // Initialize all the pixelStrips
  Ring1.begin();
  Ring2.begin();
  Ring3.begin();

  Ring1.setBrightness(120);
  Ring2.setBrightness(120);
  Ring3.setBrightness(120);
  
  // Kick off patterns
  Ring1.TheaterChase(Ring1.Color(255,255,0), Ring1.Color(0,0,50), 100);
  Ring2.RainbowCycle(3);
  Ring2.Color1 = Ring1.Color1;
  Ring3.TheaterChase(Ring3.Color(175,58,0), Ring3.Color(30,60,50), 300);

  // Init Bluefruit
  Bluefruit.begin();
  // Set max power. Accepted values are: -40, -30, -20, -16, -12, -8, -4, 0, 4
  Bluefruit.setTxPower(4);
  Bluefruit.setName("Jeanne's Clouds");
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

pattern Ring1_curPattern = FADE;
pattern Ring2_curPattern = FADE;
pattern Ring3_curPattern = FADE;

// Main loop
void loop()
{
    // Update the rings.
    Ring1.Update();
    Ring2.Update(); 
    Ring3.Update();  
    
    if ( Bluefruit.connected() ) {
      int command = bleuart.read();
    
      switch (command) {
        case 'A': { // test
  //        commandSendA();
          // Switch Ring1 to FADE pattern
          Ring1.ActivePattern = FADE;
          Ring1.Interval = 20;
          Ring2.ActivePattern = FADE;
          Ring2.Interval = 100;
          Ring3.ActivePattern = FADE;
          Ring3.Interval = 200;
          break;
        }
        case 'B': {   // Set Brightness
          int test = bleuart.read();
          commandSetBrightness(test);
          break;
        }
        case 'C': {   // Set Pixel
          int cloudNum = bleuart.read();
          int interval = bleuart.read();
          Serial.println("--CloudNum--");
          Serial.println(cloudNum);
          Serial.println("--interval--");
          Serial.println(interval);
          break;
        }
      }
    
      
    
//    // Switch patterns on a button press:
//    if (digitalRead(8) == LOW) // Button #1 pressed
//    {
//        // Switch Ring1 to FADE pattern
//        Ring1.ActivePattern = FADE;
//        Ring1.Interval = 20;
//        // Speed up the rainbow on Ring2
//        Ring2.Interval = 0;
//        // Set stick to all red
//        Stick.ColorSet(Stick.Color(255, 0, 0));
//    }
//    else if (digitalRead(9) == LOW) // Button #2 pressed
//    {
//        // Switch to alternating color wipes on Rings1 and 2
//        Ring1.ActivePattern = COLOR_WIPE;
//        Ring2.ActivePattern = COLOR_WIPE;
//        Ring2.TotalSteps = Ring2.numPixels();
//        // And update tbe stick
//        Stick.Update();
//    }
//    else // Back to normal operation
//    {
        // Restore all pattern parameters to normal values
//        Ring1.ActivePattern = THEATER_CHASE;
//        Ring1.Interval = 100;
//        Ring2.ActivePattern = RAINBOW_CYCLE;
//        Ring2.TotalSteps = 255;
//        Ring2.Interval = min(10, Ring2.Interval);
//        Ring3.ActivePattern = THEATER_CHASE;
//        Ring3.Interval = 500;
//    }   

 
  }
}

//------------------------------------------------------------
//Completion Routines - get called on completion of a pattern
//------------------------------------------------------------

// Ring1 Completion Callback
void Ring1Complete()
{
//    if (digitalRead(9) == LOW)  // Button #2 pressed
//    {
//        // Alternate color-wipe patterns with Ring2
//        Ring2.Interval = 40;
//        Ring1.Color1 = Ring1.Wheel(random(255));
//        Ring1.Interval = 20000;
//    }
//    else  // Retrn to normal
//    {
        Ring1.Reverse();
//    }
}

// Ring 2 Completion Callback
void Ring2Complete()
{
//    if (digitalRead(9) == LOW)  // Button #2 pressed
//    {
//        // Alternate color-wipe patterns with Ring1
//        Ring1.Interval = 20;
//        Ring2.Color1 = Ring2.Wheel(random(255));
//        Ring2.Interval = 20000;
//    }
//    else  // Retrn to normal
//    {
//        Ring2.RainbowCycle(random(0,10));
          Ring2.Reverse();
//    }
}

// Ring 3 Completion Callback
void Ring3Complete()
{
//    if (digitalRead(9) == LOW)  // Button #2 pressed
//    {
//        // Alternate color-wipe patterns with Ring1
//        Ring1.Interval = 20;
//        Ring2.Color1 = Ring2.Wheel(random(255));
//        Ring2.Interval = 20000;
//    }
//    else  // Retrn to normal
//    {
//        Ring3.RainbowCycle(random(0,10));
          Ring3.Reverse();
//    }
}



/******************
 * COMMAND FUNCTIONS
******************/
void sendResponse(char const *response) {
    Serial.printf("Send Response: %s\n", response);
    bleuart.write(response, strlen(response)*sizeof(char));
}

void commandSendA() {
  Serial.println("----------------------------------------");
  Serial.println("IN A mothaFUCKA!!!!!");
//
//  colorWipe(Ring1, Ring1.Color(255, 0, 0), 2000); // Red
//  colorWipe(Ring2, Ring2.Color(0, 255, 0), 2000); // Green
//  colorWipe(Ring3, Ring3.Color(0, 0, 255), 2000); // Blue
//
//  colorWipe(Ring3, Ring3.Color(255, 0, 0), 2000); // Red
//  colorWipe(Ring1, Ring1.Color(0, 255, 0), 2000); // Green
//  colorWipe(Ring2, Ring2.Color(0, 0, 255), 2000); // Blue
//
//  colorWipe(Ring2, Ring3.Color(255, 0, 0), 2000); // Red
//  colorWipe(Ring3, Ring1.Color(0, 255, 0), 2000); // Green
//  colorWipe(Ring1, Ring2.Color(0, 0, 255), 2000); // Blue
}

void commandSetBrightness(int test) {
  Serial.println("----------------------------------------");
  Serial.println("IN B mothaFUCKA!!!!!");

   // Read value
//  uint8_t brightness = bleuart.read();
  Serial.println("brightness...");
  Serial.println(test);

  // Set brightness
  Ring1.setBrightness(test);
  Ring2.setBrightness(test);
  Ring3.setBrightness(test);

  // Show brightness
  Ring1.show();
  Ring2.show();
  Ring3.show();
  
  // Refresh pixels
  swapBuffers(Ring1);
  swapBuffers(Ring2);
  swapBuffers(Ring3);

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
