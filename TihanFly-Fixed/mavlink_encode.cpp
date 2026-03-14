#include "mavlink/common/mavlink.h"

void encode_heartbeat(uint8_t *buffer, uint16_t &len)
{
    mavlink_message_t msg;
    mavlink_heartbeat_t hb{};

    hb.type = MAV_TYPE_QUADROTOR;
    hb.autopilot = MAV_AUTOPILOT_ARDUPILOTMEGA;
    hb.base_mode = MAV_MODE_GUIDED_ARMED;
    hb.system_status = MAV_STATE_ACTIVE;

    mavlink_msg_heartbeat_encode(1, 200, &msg, &hb); \\Creates MAVLink message structure
    len = mavlink_msg_to_send_buffer(buffer, &msg); \\Coverts it into raw bytes
}
