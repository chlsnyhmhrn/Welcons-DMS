import {
  useEffect,
  useState,
  useMemo
} from "react";

import MainLayout from "../layout/MainLayout";

import {
  Box,
  Typography,
  Divider,
  Chip,
  TextField,
  MenuItem
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useAuth } from "../context/AuthContext";

export default function LogAktivitas() {

  const { user } = useAuth();

  const [logs, setLogs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    filterAktivitas,
    setFilterAktivitas
  ] = useState("Semua");

  // ================= FETCH =================
  useEffect(() => {

    // 🔥 CEGAH USER UNDEFINED
    if (!user?.id_user) return;

    fetch(
      "http://localhost:5000/log",
      {
        headers: {
          id_user:
            user.id_user,

          role:
            user.role
        }
      }
    )

      .then((res) => {

        if (!res.ok)
          throw new Error(
            "API ERROR"
          );

        return res.json();
      })

      .then((res) => {

        console.log(
          "LOG DATA:",
          res
        );

        setLogs(res);
      })

      .catch((err) => {

        console.error(
          "ERROR FETCH LOG:",
          err
        );

        setLogs([]);
      });

  }, [user]);

  // ================= FILTER =================
  const filteredLogs =
    useMemo(() => {

      return logs.filter(
        (log) => {

          const namaDokumen =
            log.nama_dokumen?.toLowerCase() ||
            "";

          const namaProyek =
            log.nama_proyek?.toLowerCase() ||
            "";

          const namaUser =
            log.nama_lengkap?.toLowerCase() ||
            "";

          const matchSearch =

            namaDokumen.includes(
              search.toLowerCase()
            ) ||

            namaProyek.includes(
              search.toLowerCase()
            ) ||

            namaUser.includes(
              search.toLowerCase()
            );

          const matchAktivitas =

            filterAktivitas ===
              "Semua" ||

            log.aktivitas ===
              filterAktivitas;

          return (
            matchSearch &&
            matchAktivitas
          );
        }
      );

    }, [
      logs,
      search,
      filterAktivitas
    ]);

  // ================= ICON =================
  const getIcon = (
    aktivitas
  ) => {

    if (
      aktivitas?.includes(
        "Upload"
      )
    ) {

      return (
        <DescriptionOutlinedIcon color="primary" />
      );
    }

    if (
      aktivitas?.includes(
        "Revisi"
      )
    ) {

      return (
        <EditOutlinedIcon color="warning" />
      );
    }

    if (
      aktivitas?.includes(
        "Status"
      )
    ) {

      return (
        <SyncAltOutlinedIcon color="success" />
      );
    }

    if (
      aktivitas?.includes(
        "Hapus"
      )
    ) {

      return (
        <DeleteOutlineOutlinedIcon color="error" />
      );
    }

    return (
      <DescriptionOutlinedIcon />
    );
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (
    status
  ) => {

    if (status === "Final")
      return "success";

    if (
      status ===
      "Perlu Revisi"
    )
      return "warning";

    if (
      status === "Obsolete"
    )
      return "error";

    return "default";
  };

  return (
    <MainLayout title="Log Aktivitas">

      {/* ================= FILTER ================= */}
      <Box
        sx={{
          position: "sticky",

          top: 10,

          zIndex: 100,

          bgcolor: "#F4F6F8",

          pb: 1
        }}
      >

        <Box
          display="flex"
          gap={2}
          alignItems="center"
        >

          {/* SEARCH */}
          <TextField
            size="small"
            placeholder="Cari dokumen, proyek, atau user..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            sx={{ flex: 1 }}
          />

          {/* FILTER */}
          <TextField
            select
            size="small"
            label="Aktivitas"
            value={
              filterAktivitas
            }
            onChange={(e) =>
              setFilterAktivitas(
                e.target.value
              )
            }
            sx={{ width: 200 }}
          >

            <MenuItem value="Semua">
              Semua
            </MenuItem>

            <MenuItem value="Upload Dokumen">
              Upload
            </MenuItem>

            <MenuItem value="Revisi Dokumen">
              Revisi
            </MenuItem>

            <MenuItem value="Update Status">
              Update Status
            </MenuItem>

            <MenuItem value="Hapus Dokumen">
              Hapus
            </MenuItem>

          </TextField>

        </Box>

      </Box>

      {/* ================= LIST ================= */}
      <Box
        sx={{
          bgcolor: "white",

          borderRadius: 3,

          p: 2,

          height:
            "calc(100vh - 220px)",

          overflowY: "auto"
        }}
      >

        {filteredLogs.length >
        0 ? (

          filteredLogs.map(
            (
              log,
              index
            ) => (

              <Box
                key={
                  log.id_log
                }
                py={2}
              >

                <Box
                  display="flex"
                  gap={2}
                >

                  <Box mt={0.5}>

                    {getIcon(
                      log.aktivitas
                    )}

                  </Box>

                  <Box flex={1}>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                    >

                      <Typography fontWeight="bold">

                        {(log.nama_lengkap || "User") +
                          " melakukan " +
                          (log.aktivitas?.toLowerCase() || "-")}

                      </Typography>

                      {log.status_baru && (

                        <Chip
                          label={
                            log.status_baru
                          }
                          size="small"
                          color={getStatusColor(
                            log.status_baru
                          )}
                        />

                      )}

                    </Box>

                    <Box mt={0.5}>

                      {log.nama_dokumen && (

                        <Typography variant="body2">
                          📄{" "}
                          {
                            log.nama_dokumen
                          }
                        </Typography>

                      )}

                      {log.nama_proyek && (

                        <Typography variant="body2">
                          🏗️{" "}
                          {
                            log.nama_proyek
                          }
                        </Typography>

                      )}

                      {log.nama_kategori && (

                        <Typography variant="body2">
                          📁{" "}
                          {
                            log.nama_kategori
                          }
                        </Typography>

                      )}

                    </Box>

                    {(log.status_lama ||
                      log.status_baru) && (

                      <Box
                        mt={0.5}
                        display="flex"
                        gap={1}
                        alignItems="center"
                      >

                        {log.status_lama && (

                          <Chip
                            label={
                              log.status_lama
                            }
                            size="small"
                          />

                        )}

                        {log.status_lama &&
                          log.status_baru && (

                          <Typography variant="caption">
                            →
                          </Typography>

                        )}

                        {log.status_baru &&
                          log.status_lama && (

                          <Chip
                            label={
                              log.status_baru
                            }
                            size="small"
                            color={getStatusColor(
                              log.status_baru
                            )}
                          />

                        )}

                      </Box>

                    )}

                    {log.keterangan && (

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        📝{" "}
                        {
                          log.keterangan
                        }
                      </Typography>

                    )}

                    <Typography
                      variant="caption"
                      display="block"
                      mt={0.5}
                    >

                      {log.nama_lengkap ||
                        "User"}

                      {" • "}

                      {log.timestamp
                        ? new Date(
                            log.timestamp
                          ).toLocaleString()
                        : "-"}

                    </Typography>

                  </Box>

                </Box>

                {index !==
                  filteredLogs.length -
                    1 && (

                  <Divider
                    sx={{
                      mt: 2
                    }}
                  />

                )}

              </Box>
            )
          )

        ) : (

          <Typography textAlign="center">
            Tidak ada aktivitas
          </Typography>

        )}

      </Box>

    </MainLayout>
  );
}