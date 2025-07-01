"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const t = useTranslations("Index");

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const items = [
    {
      icon: <ListAltIcon />,
      title: t("featureCard1Title"),
      description: t("featureCard1SubTitle"),
      image: `/Images/form-generation.png`,
    },
    {
      icon: <PictureAsPdfIcon />,
      title: t("featureCard2Title"),
      description: t("featureCard2SubTitle"),
      image: `/Images/pdf-image.png`,
    },
    {
      icon: <AddPhotoAlternateIcon />,
      title: t("featureCard3Title"),
      description: t("featureCard3SubTitle"),
      image: `/Images/concent-form.png`,
    },
  ];
  // const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Typography
            component="h3"
            variant="h3"
            color="text.primary"
            paddingBottom={2}
          >
            {t("featureTitle")}
          </Typography>

          <Grid
            item
            gap={1}
            sx={{
              display: { xs: "flex", sm: "none" },
              flexDirection: "row",
              overflowX: "auto",
              width: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderColor: (theme) => {
                    if (theme.palette.mode === "light") {
                      return selectedItemIndex === index ? "primary.light" : "";
                    }
                    return selectedItemIndex === index ? "primary.light" : "";
                  },
                  background: (theme) => {
                    if (theme.palette.mode === "light") {
                      return selectedItemIndex === index ? "none" : "";
                    }
                    return selectedItemIndex === index ? "none" : "";
                  },
                  backgroundColor:
                    selectedItemIndex === index ? "primary.main" : "",
                  "& .MuiChip-label": {
                    color: selectedItemIndex === index ? "#fff" : "",
                  },
                }}
              />
            ))}
          </Grid>

          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: "100%", display: { xs: "none", sm: "flex" } }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                variant="outlined"
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={{
                  p: 3,
                  height: "fit-content",
                  width: "100%",
                  background: "none",
                  backgroundColor:
                    selectedItemIndex === index ? "action.selected" : undefined,
                  borderColor: (theme) => {
                    if (theme.palette.mode === "light") {
                      return selectedItemIndex === index
                        ? "primary.light"
                        : "grey.200";
                    }
                    return selectedItemIndex === index
                      ? "primary.dark"
                      : "grey.800";
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    textAlign: "left",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { md: "center" },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      color: (theme) => {
                        if (theme.palette.mode === "light") {
                          return selectedItemIndex === index
                            ? "primary.main"
                            : "grey.300";
                        }
                        return selectedItemIndex === index
                          ? "primary.main"
                          : "grey.700";
                      },
                    }}
                  >
                    {icon}
                  </Box>
                  <Box sx={{ textTransform: "none" }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ my: 0.5 }}
                    >
                      {description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: "flex", sm: "flex" }, width: "100%" }}
          flexDirection="column-reverse"
        >
          <Card
            variant="outlined"
            sx={{
              height: { sm: "90%" },
              width: "100%",
              // display: { xs: "none", sm: "flex" },
              pointerEvents: "none",
            }}
          >
            <Image
              src={items[selectedItemIndex].image}
              alt="Image"
              width={420}
              height={500}
              style={{ objectFit: "contain" }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
