import { Button, Flex, Grid, Text, useToast } from "@chakra-ui/core";
import download from 'downloadjs';
import Link from 'next/link'
import copy from "copy-to-clipboard";
import {useContext, useMemo} from "react";
import {IconStyleContext} from "./CustomizeIconContext";
import {IconWrapper} from "./IconWrapper";
import { useRouter } from "next/router";

const IconList = ({icons}) => {
  const router = useRouter()
  const toast = useToast();
  const {color, size, strokeWidth} = useContext(IconStyleContext);
  const { search } = router.query;

  const query = useMemo(()=> search !== undefined ? { search } : {},[search])

  return (
    <Grid
      templateColumns={`repeat(auto-fill, minmax(160px, 1fr))`}
      gap={5}
      marginBottom="320px"
    >
      { icons.map((icon) => {
        const actualIcon = icon.item ? icon.item : icon;
        const { name, content } = actualIcon;

        return (
          <Link
            key={name}
            scroll={false}
            href={{
              pathname: '/icon/[iconName]',
              query: {
                ...query,
                iconName: name,
              },
            }}
          >
            <Button
              variant="ghost"
              borderWidth="1px"
              rounded="lg"
              padding={16}
              onClick={(event) => {
                if (event.shiftKey) {
                  copy(actualIcon.src);
                  toast({
                    title: "Copied!",
                    description: `Icon "${name}" copied to clipboard.`,
                    status: "success",
                    duration: 1500,
                  });
                }
                if (event.metaKey) {
                  download(
                    actualIcon.src,
                    `${name}.svg`,
                    "image/svg+xml"
                  );
                }
              }}
              key={name}
              alignItems="center"
            >
              <Flex direction="column" align="center" justify="center">
                <IconWrapper
                  content={content}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  height={size}
                  width={size}
                />
                <Text marginTop={5}>{name}</Text>
              </Flex>
            </Button>
          </Link>
        );
      })}
    </Grid>
  );
}

export default IconList;
