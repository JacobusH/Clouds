# 1 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino"
# 1 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino"
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
# 42 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2
# 43 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2
# 44 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2
# 45 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2

# 47 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2
# 48 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2
# 49 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2
# 50 "/InnerTome/Projects/clouds/arduino/clouds_new/clouds_new.ino" 2

// BLE Service
// BLEDis  bledis;
// BLEUart bleuart;

boolean firstConact = true; // TODO: set to false when dynamic input for clouds
boolean enteredFunc = false;
void CloudComplete();
void getClouds();
std::vector<NeoPatterns> Clouds(4);
NeoPatterns Ring1(24, 16, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) /* 0x52*/ + 0x0000 /* 800 KHz datastream*/, &CloudComplete);
NeoPatterns Ring2(24, 30, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) /* 0x52*/ + 0x0000 /* 800 KHz datastream*/, &CloudComplete);
NeoPatterns Ring3(24, 15, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) /* 0x52*/ + 0x0000 /* 800 KHz datastream*/, &CloudComplete);
NeoPatterns Ring4(24, 27, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) /* 0x52*/ + 0x0000 /* 800 KHz datastream*/, &CloudComplete);

int loopTimer = 0;
// unsigned long lastUpdate = millis();
// int lastCloud = 0;


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

  // for(int i = 0; i < Clouds.size(); i++) {
  //   NeoPatterns& tmp = Clouds.at(i);
  //   tmp.begin();
  //   tmp.setBrightness(60);
  //   // tmp.RainbowCycle(5);
  //   // tmp.TheaterChase(Ring1.Color(255,255,0), Ring1.Color(0,0,50), 5000);
  //   // tmp.Scanner(tmp.Wheel(random(255)), 100);
  // }


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
  Bluefruit.Advertising.addFlags(((0x02) /**< LE General Discoverable Mode. */ | (0x04) /**< BR/EDR not supported. */) /**< LE General Discoverable Mode, BR/EDR not supported. */);
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
  Bluefruit.Advertising.setInterval(32, 244); // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30); // number of seconds in fast mode
  Bluefruit.Advertising.start(0); // 0 = Don't stop advertising after n seconds  
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
  if(loopTimer % 100000 == 0) {
    // Serial.println("----- In Loop Cycle -----");
    // Serial.println(Clouds.size());
    loopTimer = 0;
  }

  // Update cycle
  for(int i = 0; i < Clouds.size(); i++) {
    Clouds[i].Update();
  }


  if ( Bluefruit.connected() ) {
    if(loopTimer % 100000 == 0) {
      Serial.println("----- In BLE Cycle -----");
      Serial.println(Clouds.size());
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

        enteredFunc = true;
        Serial.println("After cycle");

        break;
      }
      case 'B': { // Set Brightness
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


        for(int i = 0; i < curCloud.numPixels(); i++) {
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
    NeoPatterns tmpCloud(24, 16, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) /* 0x52*/ + 0x0000 /* 800 KHz datastream*/, &CloudComplete);
    Clouds.push_back(tmpCloud);
  }
}
# 1 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino"

# 3 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino" 2
# 4 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino" 2



// empty constructor
NeoPatterns::NeoPatterns()
:Adafruit_NeoPixel(24, 7, ((1 << 6) | (1 << 4) | (0 << 2) | (2)) /* 0x52*/ + 0x0000 /* 800 KHz datastream*/)
{

}

// Constructor - calls base-class constructor to initialize strip
NeoPatterns::NeoPatterns(uint16_t pixels, uint16_t pin, uint8_t type, void (*callback)())
:Adafruit_NeoPixel(pixels, pin, type)
{
    OnComplete = callback;
}

// Update the pattern
void NeoPatterns::Update()
{
     Serial.println("Generic Update");
     Serial.println(lastUpdate);
     Serial.println(Interval);
    if((millis() - lastUpdate) > Interval) // time to update
    {
        Serial.println("Time to update");
        lastUpdate = millis();
        switch(ActivePattern)
        {
            case RAINBOW_CYCLE:
                Serial.println("In rainbox update generic");
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
            case NONE:
                // do nothing
                break;
            default:
                break;
        }
    }
}

// Increment the Index and reset at the end
void NeoPatterns::Increment()
{
    if (Direction == FORWARD)
    {
        Index++;
        if (Index >= TotalSteps)
        {
            Index = 0;
            if (OnComplete != 
# 67 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino" 3 4
                             __null
# 67 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino"
                                 )
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
            if (OnComplete != 
# 79 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino" 3 4
                             __null
# 79 "/InnerTome/Projects/clouds/arduino/clouds_new/d_neoPatterns.ino"
                                 )
            {
                OnComplete(); // call the comlpetion callback
            }
        }
    }
}

// Reverse pattern direction
void NeoPatterns::Reverse()
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
void NeoPatterns::RainbowCycle(uint8_t interval, direction dir)
{
    ActivePattern = RAINBOW_CYCLE;
    Interval = interval;
    TotalSteps = 255;
    Index = 0;
    Direction = dir;
}

// Update the Rainbow Cycle Pattern
void NeoPatterns::RainbowCycleUpdate()
{
    Serial.println("Rainbow Cycle Update");
    for(int i=0; i< numPixels(); i++)
    {
        setPixelColor(i, Wheel(((i * 256 / numPixels()) + Index) & 255));
    }
    show();
    Increment();
}

// Initialize for a Theater Chase
void NeoPatterns::TheaterChase(uint32_t color1, uint32_t color2, uint8_t interval, direction dir)
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
void NeoPatterns::TheaterChaseUpdate()
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
void NeoPatterns::ColorWipe(uint32_t color, uint8_t interval, direction dir)
{
    ActivePattern = COLOR_WIPE;
    Interval = interval;
    TotalSteps = numPixels();
    Color1 = color;
    Index = 0;
    Direction = dir;
}

// Update the Color Wipe Pattern
void NeoPatterns::ColorWipeUpdate()
{
    setPixelColor(Index, Color1);
    show();
    Increment();
}

// Initialize for a SCANNNER
void NeoPatterns::Scanner(uint32_t color1, uint8_t interval)
{
    ActivePattern = SCANNER;
    Interval = interval;
    TotalSteps = (numPixels() - 1) * 2;
    Color1 = color1;
    Index = 0;
}

// Update the Scanner Pattern
void NeoPatterns::ScannerUpdate()
{
    for (int i = 0; i < numPixels(); i++)
    {
        if (i == Index) // Scan Pixel to the right
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
void NeoPatterns::Fade(uint32_t color1, uint32_t color2, uint16_t steps, uint8_t interval, direction dir)
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
void NeoPatterns::FadeUpdate()
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

// void NeoPatterns::SinglePixel(uint8_t interval, uint32_t color1) {
//     ActivePattern = SINGLEPIXEL;
//     Interval = interval;
//     TotalSteps = (numPixels() - 1) * 2;
//     Color1 = color1;
//     Index = 0;
// }

// void NeoPatterns::SinglePixelUpdate() {
//     for (int i = 0; i < numPixels(); i++)
//     {
//         if (i == Index)  // Scan Pixel to the right
//         {
//                 setPixelColor(i, Color1);
//         }
//         // else if (i == Index -1) // Scan Pixel to the left
//         // {
//         //         setPixelColor(i, Color1);
//         // }
//         // else // Fading tail
//         // {
//         //         setPixelColor(i, DimColor(getPixelColor(i)));
//         // }
//     }
//     show();
//     Increment();
// }

// Calculate 50% dimmed version of a color (used by ScannerUpdate)
uint32_t NeoPatterns::DimColor(uint32_t color)
{
    // Shift R, G and B components one bit to the right
    uint32_t dimColor = Color(Red(color) >> 1, Green(color) >> 1, Blue(color) >> 1);
    return dimColor;
}

// Set all pixels to a color (synchronously)
void NeoPatterns::ColorSet(uint32_t color)
{
    for (int i = 0; i < numPixels(); i++)
    {
        setPixelColor(i, color);
    }
    show();
}

// Returns the Red component of a 32-bit color
uint8_t NeoPatterns::Red(uint32_t color)
{
    return (color >> 16) & 0xFF;
}

// Returns the Green component of a 32-bit color
uint8_t NeoPatterns::Green(uint32_t color)
{
    return (color >> 8) & 0xFF;
}

// Returns the Blue component of a 32-bit color
uint8_t NeoPatterns::Blue(uint32_t color)
{
    return color & 0xFF;
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t NeoPatterns::Wheel(byte WheelPos)
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
# 1 "/InnerTome/Projects/clouds/arduino/clouds_new/e_commands.ino"

# 3 "/InnerTome/Projects/clouds/arduino/clouds_new/e_commands.ino" 2
# 4 "/InnerTome/Projects/clouds/arduino/clouds_new/e_commands.ino" 2



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

void commandSetBrightness(int bVal, Adafruit_NeoPixel cur_cloud) {
    Serial.println("----------------------------------------");
    Serial.println("IN Brightness mothaFUCKA!!!!!");

    // Read value
    // uint8_t brightness = bleuart.read();
    Serial.println("brightness...");
    Serial.println(bVal);

    // Set brightness
    cur_cloud.setBrightness(bVal);

    // Show brightness
    cur_cloud.show();

    // Refresh pixels
    swapBuffers(cur_cloud);

    // Done
    sendResponse("OK");
}

void commandSetPixel(Adafruit_NeoPixel cur_cloud) {
  Serial.println("----------------------------------------");
  Serial.println((reinterpret_cast<const __FlashStringHelper *>(("Command: SetPixel"))));

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
    pixelIndex += stride - width; // Move pixelIndex to the next row (take into account the stride)
  }
  cur_cloud.show();

}
# 1 "/InnerTome/Projects/clouds/arduino/clouds_new/f_helpers.ino"
# 2 "/InnerTome/Projects/clouds/arduino/clouds_new/f_helpers.ino" 2

# 4 "/InnerTome/Projects/clouds/arduino/clouds_new/f_helpers.ino" 2

// #include <string>


// void hexToRGB(String hexVal) {
//   // hexVal="FFFFFF"

//   char charbuf[8];
//   hexVal.toCharArray(charbuf,8);
//   long int rgb = std::stol(charbuf,0,16);
//   byte r = (byte)(rgb>>16);
//   byte g = (byte)(rgb>>8);
//   byte b = (byte)(rgb);

//   Serial.println("-- RGB Val -- ");
//   Serial.println(r);
//   Serial.println(g);
//   Serial.println(b);
// }
# 1 "/InnerTome/Projects/clouds/arduino/clouds_new/z_main.ino"
