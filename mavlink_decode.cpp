#include <iostream>
#include "mavlink/common/mavlink.h"

void decode_message(const uint8_t *buffer, uint16_t len)
{
    mavlink_message_t msg;
    mavlink_status_t status;

    for (uint16_t i = 0; i < len; i++)
    {
        if (mavlink_parse_char(MAVLINK_COMM_0, buffer[i], &msg, &status))  \\parses byte stream
        {
            if (msg.msgid == MAVLINK_MSG_ID_HEARTBEAT)
            {
                mavlink_heartbeat_t hb;
                mavlink_msg_heartbeat_decode(&msg, &hb); \\Extracts fields

                std::cout << "Heartbeat Received\n";
                std::cout << "Type: " << (int)hb.type << "\n";
                std::cout << "Autopilot: " << (int)hb.autopilot << "\n";
                std::cout << "Base Mode: " << (int)hb.base_mode << "\n";
            }
        }
    }
}
