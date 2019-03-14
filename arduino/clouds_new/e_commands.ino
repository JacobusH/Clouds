#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <bluefruit.h>
#include "cz_blue.h"
#include "e_commands.h"

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