import { Card, Col, Row, Typography } from "antd"

const { Text, Title } = Typography;

const Faq = () => {

    const tutorials = [
        {
            title: "Basic Controls",
            link: "https://www.youtube.com/embed/on3BtXVTP0o?si=TVTguXCXVJarBEEu"
        },
        {
            title: "Stickhandling",
            link: "https://www.youtube.com/embed/XXbBLaKNCQQ?si=kjOOJnrs0x3DuE2K"
        },
        {
            title: "Shooting",
            link: "https://www.youtube.com/embed/wxFT5KPPvos?si=XsYEy61uXrSAk5Gj"
        },
        {
            title: "Defense",
            link: "https://www.youtube.com/embed/9ZENTxEAqWU?si=-u-V_Pr9GBZA3-sN"
        },
        {
            title: "Momentum",
            link: "https://www.youtube.com/embed/xSoHvTV-5Cc?si=8w5e_vjlo3DR3dI2"
        },
        {
            title: "Goaltending",
            link: "https://www.youtube.com/embed/yDvoeTqsiKE?si=rVfMY7TqMIzh_iOt"
        },
    ]

    return <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Basics" bordered={false}>
            <div style={{ padding: 24 }}>
                <Text >
                    Firstly welcome to the community and the game. There are some things everyone should know before jumping into this game. This game starts out very very difficult so don't feel discouraged. It's a lot to take in at once, but the key is to keep practicing. Start by getting used to stick handling in shooting on servers by yourself. As you become more comfortable with that, move up to playing in pick up games with other people. The barrier to entry can feel more like a cliff, once you get over that first hump, it's insanely fun. You will never experience anything else like it.
                    In order to get involved in the community, stay active on the discord and try to play some every day if you can. You'll be able to see yourself improve, and rest assured others will notice. Also, try not to be discouraged by anyone as you learn.
                </Text>
            </div>
        </Card>
        <Card title="Controls" bordered={false}>
            <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                <Text >Left mouse: snap view to puck</Text>
                <Text >Right mouse: freelook</Text>
                <Text >Mousewheel: rotate stick angle (Very important)</Text>
                <Text >Shift: stop</Text>
                <Text >Shift + A/D: pivot right/left</Text>
                <Text >Ctrl: slide</Text>
                <Text >M: enables map. This will not work on Mac versions of the game</Text>
                <Text >N: displays names on the map while on the ice (this flips the map when on blue team)</Text>
                <Text >Tab: scoresheet</Text>
                <Text >U: Turn on or off the UI</Text>
                <Text >0: return to spectator mode if you're on the ice. If you're a spectator this will enable/disable the spectator cameras on keys 1-4</Text>
                <Text >1-4: As spectator buttons 1-4 are different camera angles that you can use to spectate with. 1-3 are static angles, but 4 is a free cam</Text>
                <Text >Free cam spectating: Once you are in free cam spectate, WASD will move your camera's position, Q moves the camera up, Z moves it down, Shift will speed you up while Ctrl will slow it down, holding left mouse follows the pucks while holding right mouse will allow you to reposition the camera to any angle.
                </Text>
                <Text >You can also set your position with /sp C,RW,LW,RD,LD, and G.
                </Text>
            </div>
        </Card>
        <Card title="Server commands" bordered={false}>
            <div style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                <Text >{"/l <password>: login on server"}</Text>
                <Text >{"/p <char>: pick player"}</Text>
                <Text >{"/help: list of commands"}</Text>
                <Text >{"/rs: resign"}</Text>
                <Text >{"/vr: vote to reset game"}</Text>
                <Text >{"/vk <player index>: vote for kick player"}</Text>
                <Text >{"/vp: vote for pause game"}</Text>
            </div>
        </Card>
        <Card title="Tutorials" bordered={false}>
            <div style={{ padding: 8 }}>
                <Row gutter={[32, 32]}>
                    {tutorials.map(tutorial => {
                        return <Col sm={8} xs={24} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <Text>{tutorial.title}</Text>
                            <iframe style={{ borderRadius: 16 }} frameBorder={0} height="450" src={tutorial.link} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </Col>
                    })}


                </Row>
            </div>
        </Card>
    </div>
}

export default Faq