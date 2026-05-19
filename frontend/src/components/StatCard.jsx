import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color={`${color}.main`}
          >
            {value}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
