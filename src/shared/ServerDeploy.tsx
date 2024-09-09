import { Row, Col, Card, Typography, Tabs } from "antd";
import Paragraph from "antd/es/typography/Paragraph";

const { Text, Title } = Typography;

const ServerDeploy = () => {
    return <Row>
        <Col sm={7} xs={0} />
        <Col sm={10} xs={24} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Title level={5}>Server deploy</Title>
            <Card title="Docker">
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text copyable code>sudo apt update</Text>
                    <Text copyable code>sudo apt install apt-transport-https ca-certificates curl software-properties-common</Text>
                    <Text copyable code>curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -</Text>
                    <Text copyable code>sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"</Text>
                    <Text copyable code>sudo apt update</Text>
                    <Text copyable code>apt-cache policy docker-ce</Text>
                    <Text copyable code>sudo apt install docker-ce</Text>
                    <Text copyable code>sudo systemctl status docker</Text>
                </div>
            </Card>
            <Card title="Docker-compose">
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text copyable code>sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose</Text>
                    <Text copyable code>sudo chmod +x /usr/local/bin/docker-compose</Text>
                </div>
            </Card>
            <Card title="Server">
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text copyable code>cd /root</Text>
                    <Text copyable code>mkdir services</Text>
                    <Text copyable code>mkdir volumes</Text>
                    <Text copyable code>cd /root/services</Text>
                    <Text copyable code>cd server</Text>
                    <Text copyable code>nano docker-compose.yml</Text>
                    <br />
                    <Text italic>Paste code and save</Text>
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: "Ranked",
                                label: "Ranked",
                                children: <Text code copyable style={{ whiteSpace: "pre-wrap" }}>
                                    {`version: '3.1'
volumes:
  server:
services:
  server:
    image: rust
    restart: always
    volumes:
      - ~/volumes/hqm-ranked-server:/app
    working_dir: /app
    command: /bin/bash -c "cargo run"
    ports:
      - 27585:27585/udp
`}
                                </Text>
                            },
                            {
                                key: "Default",
                                label: "Default",
                                children: <Text code copyable style={{ whiteSpace: "pre-wrap" }}>
                                    {`version: '3.1'
volumes:
  server:
services:
  server:
    image: rust
    restart: always
    volumes:
      - ~/volumes/migo-hqm-server:/app
    working_dir: /app
    command: /bin/bash -c "cargo run"
    ports:
      - 27585:27585/udp
`}
                                </Text>
                            },
                        ]}
                    />
                    <br />
                    <Text copyable code>cd /root/volumes/</Text>
                    <Tabs
                        defaultActiveKey="1"
                        items={[
                            {
                                key: "Ranked",
                                label: "Ranked",
                                children: <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <Text code copyable >
                                        git clone https://github.com/DenSemenov/hqm-ranked-server.git
                                    </Text>
                                    <Text code copyable >
                                        nano /root/volumes/hqm-ranked-server/config.ini
                                    </Text>
                                    <Text italic>Paste config and save (You can get token from admin)</Text>
                                    <Text code copyable style={{ whiteSpace: "pre-wrap" }}>
                                        {`[Server]
name=EU Ranked
port=27585
public=true
team_max=4
force_team_size_parity=false
player_max=20
password=12345
replays=true
replay_endpoint=https://api.hqmfun.space/api/Replay/ProcessHrp
welcome=hqmfun.space\nType /l to login, /help to get help commands
api=https://api.hqmfun.space
token=<YOUR TOKEN>

[Game]
spawn=center
limit_jump_speed=false
offside=off
icing=off
time_period=300
time_warmup=300
time_break=10
time_intermission=20
warmup_pucks=16
goal_replay=true
mercy=7
faceoff_shift=false
afk_time=180
spawn_player_keep_stick=true
spawn_offset=1.6
spawn_player_altitude=0.6
spawn_puck_altitude=0.1`}
                                    </Text>
                                </div>
                            },
                            {
                                key: "Default",
                                label: "Default",
                                children: <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <Text code copyable >
                                        git clone https://github.com/migomipo/migo-hqm-server.git
                                    </Text>
                                    <Text italic>Use the command below to edit the configuration</Text>
                                    <Text code copyable >
                                        nano /root/volumes/hqm-ranked-server/config.ini
                                    </Text>
                                </div>
                            },
                        ]}
                    />
                </div>
            </Card>
            <Card title="Run server">
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Text code copyable >
                        cd /root/services/server/
                    </Text>
                    <Text code copyable >
                        docker-compose up -d
                    </Text>
                </div>
            </Card>
        </Col>
    </Row>
}

export default ServerDeploy;