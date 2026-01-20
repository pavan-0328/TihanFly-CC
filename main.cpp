#include <iostream>
#include <cstdint>

void encode_heartbeat(uint8_t *buffer, uint16_t &len);
void decode_message(const uint8_t *buffer, uint16_t len);

int main()
{
    uint8_t buffer[300];
    uint16_t length = 0;

    encode_heartbeat(buffer, length);
    std::cout << "Encoded length: " << length << std::endl;

    decode_message(buffer, length);
    return 0;
}
