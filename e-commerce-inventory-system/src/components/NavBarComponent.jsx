import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
} from "@mui/material";

export default function NavBarComponent() {
  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 4 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Inventory System
                </Typography>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
