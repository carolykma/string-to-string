import { Card, Divider, Flex, Tag, Typography } from "antd"
import { GithubOutlined } from "@ant-design/icons"

export const HomePage = () => {
    return <div id="home-page" className="max-w-3xl">
        <Typography.Title level={2}>
            Welcome to String to String!
        </Typography.Title>

        <Typography.Paragraph>
            Interactive playgrounds to visualize popular string analysis algorithms
        </Typography.Paragraph>
        <Divider />

        <Card variant="outlined" className="!mb-5">
            <Typography.Paragraph>
                I built this because, well, I myself was curious how exactly those algorithms work 🤷‍♀️
            </Typography.Paragraph>

            <Typography.Paragraph>
                I know you too are not satisfied with the <i>"Levenshtein Distance is the minimum number of edits required to change one word into the other"</i> 😌
            </Typography.Paragraph>

            <Typography.Paragraph>
                So, roll up your sleeves, type in your strings, and see it with your own eyes!
            </Typography.Paragraph>
        </Card>

        <Typography.Title level={5}>
            📢Updates:
        </Typography.Title>
        <div>Levenshtein Distance <Tag color="blue">Try it out!</Tag></div>
        <div>Damerau-Levenshtein Distance <Tag color="blue">Try it out!</Tag></div>


        <Flex className="!mt-15">
            <a href="https://github.com/carolykma/string-to-string" className="hover:scale-[1.05]">
                <Typography.Title level={5}>
                    <GithubOutlined /> carolykma
                </Typography.Title>
            </a>
        </Flex>
    </div>
}