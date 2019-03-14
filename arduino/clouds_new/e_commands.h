#ifndef e_commands
#define e_commands

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <bluefruit.h>

uint8_t *pixelBuffer = NULL;
uint8_t width = 0;
uint8_t height = 0;
uint8_t stride;
uint8_t componentsValue;
bool is400Hz;
uint8_t components = 3;     // only 3 and 4 are valid values

void sendResponse(char const *response);
void commandSendA();
void commandSetBrightness(int test);
void commandSetPixel(Adafruit_NeoPixel cur_cloud);
void swapBuffers(Adafruit_NeoPixel cur_cloud);

#endif e_commands