#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

class Flasher
{
  // Class Member Variables
  // These are initialized at startup
  int ledPin;      // the number of the LED pin
  long OnTime;     // milliseconds of on-time
  long OffTime;    // milliseconds of off-time
  Adafruit_NeoPixel Cloud;
 
  // These maintain the current state
  int ledState;                 // ledState used to set the LED
  unsigned long previousMillis;   // will store last time LED was updated
 
  // Constructor - creates a Flasher 
  // and initializes the member variables and state
  public:
  Flasher(int pin, long on, long off)
  {
    ledPin = pin;
    pinMode(ledPin, OUTPUT);     
      
    OnTime = on;
    OffTime = off;
    
    ledState = LOW; 
    previousMillis = 0;

//    Cloud = Adafruit_NeoPixel(16, ledPin, NEO_GRB + NEO_KHZ800);
//    Cloud.setBrightness(25);


    
  }

  void Begin() {
    Serial.begin(115200);
//    Serial.println("begin");

    Cloud = Adafruit_NeoPixel(16, ledPin, NEO_GRB + NEO_KHZ800);
    Cloud.setBrightness(25);
  }
 
  void Update()
  {
//    Serial.println("update");
//    Serial.println(Cloud.numPixels());

    // check to see if it's time to change the state of the LED
    unsigned long currentMillis = millis();
     
    if((ledState == HIGH) && (currentMillis - previousMillis >= OnTime))
    {
      ledState = LOW;  // Turn it off
      previousMillis = currentMillis;  // Remember the time
      // Update the actual LED
      for(uint16_t i=0; i < Cloud.numPixels(); i++) {
        Cloud.setPixelColor(i, Cloud.Color(0, 0, 255));
        Cloud.show();
      }

    }
    else if ((ledState == LOW) && (currentMillis - previousMillis >= OffTime))
    {
      ledState = HIGH;  // turn it on
      previousMillis = currentMillis;   // Remember the time
      
      // Update the actual LED
      for(uint16_t i=0; i < Cloud.numPixels(); i++) {
        Cloud.setPixelColor(i, Cloud.Color(0, 255, 0));
        Cloud.show();
      }
    }
  }
};
 
 
Flasher led1(16, 100, 400);
Flasher led2(27, 350, 350);
 
void setup()
{
//  Serial.begin(115200);
//  Serial.println("setup");
  led1.Begin();
  led2.Begin();
}
 
void loop()
{
//  Serial.println("loop");
  led1.Update();
  led2.Update();
}
