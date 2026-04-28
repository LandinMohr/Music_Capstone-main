import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
 
import { Country, Song } from "../types/content";
import { GemIcon } from "../components/GemIcon";
import { Panel } from "../components/Panel";
import { ScreenScaffold } from "../components/ScreenScaffold";
import { SecondarySurfaceFill } from "../components/SecondarySurfaceFill";
import { YearSelector } from "../components/YearSelector";
import { colors } from "../theme/colors";
import { typefaces } from "../theme/typography";
 
export type Props = {
  country: Country;
  countries: Country[];
  songs: Song[];
  selectedSongId: string;
  selectedSong: Song;
  onSelectSong: (songId: string) => void;
  onSelectCountry: (countryId: string) => void;
  selectedYear: number;
  onChangeYear: (year: number) => void;
};
 
const rowBackdropColors = ["#B86A72", "#8B9BC0", "#8B5E7A", "#627F8A", "#C28C5E", "#7A7EB0"];
const cdCaseSource = require("../assets/images/CD-Case-Transparent-Image.png");
const hiddenGemTitleTerms = ["Afterlight", "Glassroom", "Signal", "Static", "Midnight", "Echo", "Receiver", "Velvet"];
const hiddenGemAlbumTerms = ["Circuit", "Atlas", "Bloom", "Relay", "Theatre", "Horizon", "Current", "Transit"];
 
function buildGeneratedHiddenGemSongs(country: Country, songs: Song[]): Song[] {
  return Array.from({ length: 25 }, (_, index) => {
    const leadArtist = country.featuredArtists[index % country.featuredArtists.length] ?? country.albumArtist;
    const titleLead = hiddenGemTitleTerms[index % hiddenGemTitleTerms.length];
    const titleTail = hiddenGemTitleTerms[(index + 3) % hiddenGemTitleTerms.length];
    const albumTail = hiddenGemAlbumTerms[index % hiddenGemAlbumTerms.length];
    const baseSong = songs[index % Math.max(songs.length, 1)];
    return {
      id: `${country.id}-generated-hidden-gem-${index + 1}`,
      title: `${country.name} ${titleLead} ${titleTail}`,
      artist: leadArtist,
      album: baseSong?.album ?? `${country.album} ${albumTail}`,
      genres: baseSong?.genres?.length ? baseSong.genres : country.genres.slice(0, 2),
      languages: baseSong?.languages?.length ? baseSong.languages : country.languages.slice(0, 2),
      year: baseSong?.year ?? 2021,
      duration: baseSong?.duration ?? "3:42",
      description: "A quieter cut with strong late-night energy and a more country-specific pull.",
      spotifySearchUrl: `https://open.spotify.com/search/${encodeURIComponent(`${leadArtist} ${country.name} ${titleLead}`)}`,
    } satisfies Song;
  });
}
 
export function HiddenGemsScreen({
  country,
  countries,
  songs,
  selectedSongId,
  selectedSong,
  onSelectSong,
  onSelectCountry,
  selectedYear,
  onChangeYear,
}: Props) {
  const hiddenGemSongs = useMemo(
    () => [...songs, ...buildGeneratedHiddenGemSongs(country, songs)],
    [country, songs]
  );
 
  const [activeSongId, setActiveSongId] = useState(
    () => selectedSongId || selectedSong?.id || hiddenGemSongs[0]?.id || ""
  );
 
  const safeSelectedSong =
    hiddenGemSongs.find((s) => s.id === activeSongId) ??
    hiddenGemSongs.find((s) => s.id === selectedSongId) ??
    selectedSong ??
    hiddenGemSongs[0];
 
  useEffect(() => {
    if (selectedSongId && hiddenGemSongs.some((s) => s.id === selectedSongId)) {
      setActiveSongId(selectedSongId);
    }
  }, [hiddenGemSongs, selectedSongId]);
 
  const selectedIndex = hiddenGemSongs.findIndex((s) => s.id === safeSelectedSong?.id);
 
  const stepSong = (dir: -1 | 1) => {
    if (!hiddenGemSongs.length || selectedIndex < 0) return;
    const next = hiddenGemSongs[(selectedIndex + dir + hiddenGemSongs.length) % hiddenGemSongs.length];
    if (next) setActiveSongId(next.id);
  };
 
  if (!safeSelectedSong) {
    return <ScreenScaffold><View style={styles.pageFrame} /></ScreenScaffold>;
  }
 
  return (
    <ScreenScaffold>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Blurb / header */}
        <Panel style={styles.blurbPanel}>
          <LinearGradient
            colors={[colors.surfaceSecondary, "#27293B", "rgba(66,72,101,0.42)", "rgba(66,72,101,0.72)"]}
            locations={[0, 0.42, 0.78, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.blurbFill}
          />
          <View style={styles.blurbContent}>
            <View style={styles.blurbCopy}>
              <Text style={styles.blurbHeading}>{country.name}'s Hidden Gems</Text>
              <Text style={styles.blurbBody}>
                Select a song to view its details. Tap the CD image to preview it on Spotify.
              </Text>
            </View>
            <View style={styles.blurbRight}>
              <YearSelector year={selectedYear} onSelectYear={onChangeYear} compact compactArrows smallLabel />
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[colors.backgroundSoft, "#74819B", "#7A4762"]}
                  locations={[0, 0.38, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.statValue}>{country.hiddenSongs}</Text>
                <Text style={styles.statLabel}>Hidden Gems</Text>
              </View>
            </View>
          </View>
        </Panel>
 
        {/* Now Playing */}
        <Panel style={styles.nowPlayingPanel}>
          <SecondarySurfaceFill />
          <View style={styles.nowPlayingContent}>
            {/* Controls */}
            <View style={styles.controls}>
              <Pressable onPress={() => stepSong(-1)} style={styles.controlBtn}>
                <GemIcon size={28} style={styles.arrowLeft} />
              </Pressable>
              <View style={styles.cdWrap}>
                <View style={styles.cdBackdrop} />
                <Image source={cdCaseSource} style={styles.cdImage} resizeMode="contain" />
              </View>
              <Pressable onPress={() => stepSong(1)} style={styles.controlBtn}>
                <GemIcon size={28} style={styles.arrowRight} />
              </Pressable>
            </View>
 
            {/* Song info */}
            <Text style={styles.songName} numberOfLines={2}>{safeSelectedSong.title}</Text>
            <Text style={styles.songArtist}>{safeSelectedSong.artist}</Text>
            <View style={styles.songUnderline} />
 
            {/* Meta */}
            {[
              { label: "Album", value: safeSelectedSong.album },
              { label: "Genre(s)", value: safeSelectedSong.genres.join(", ") },
              { label: "Language(s)", value: safeSelectedSong.languages.join(", ") },
              { label: "Year", value: `${safeSelectedSong.year}` },
            ].map((item) => (
              <View key={item.label} style={styles.metaCard}>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabelText}>{item.label}: </Text>
                  <Text style={styles.metaValueText}>{item.value}</Text>
                </Text>
              </View>
            ))}
 
            {safeSelectedSong.spotifySearchUrl ? (
              <Pressable style={styles.spotifyBtn}>
                <Text style={styles.spotifyBtnText}>Open in Spotify ↗</Text>
              </Pressable>
            ) : null}
          </View>
        </Panel>
 
        {/* Song List */}
        <Panel style={styles.listPanel}>
          <SecondarySurfaceFill />
          <View style={styles.listContent}>
            <Text style={styles.listTitle}>All Hidden Gems</Text>
            {hiddenGemSongs.slice(0, 30).map((song, i) => {
              const isSelected = song.id === safeSelectedSong.id;
              return (
                <Pressable
                  key={song.id}
                  onPress={() => setActiveSongId(song.id)}
                  style={[styles.songRow, isSelected ? styles.songRowSelected : null]}
                >
                  <Text style={[styles.songRank, isSelected ? styles.songTextActive : null]}>
                    {i + 1}.
                  </Text>
                  <View style={styles.songTextBlock}>
                    <Text
                      style={[styles.songRowTitle, isSelected ? styles.songTextActive : null]}
                      numberOfLines={1}
                    >
                      {song.title}
                    </Text>
                    <Text style={[styles.songRowArtist, isSelected ? styles.songTextActive : null]} numberOfLines={1}>
                      {song.artist}
                    </Text>
                  </View>
                  <View style={[styles.songCd, { backgroundColor: rowBackdropColors[i % rowBackdropColors.length] }]}>
                    <Image source={cdCaseSource} style={styles.songCdImg} resizeMode="contain" />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Panel>
      </ScrollView>
    </ScreenScaffold>
  );
}
 
const styles = StyleSheet.create({
  pageFrame: { flex: 1 },
  scrollContent: { gap: 16, paddingBottom: 32 },
  blurbPanel: {
    minHeight: 74,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  blurbFill: { ...StyleSheet.absoluteFillObject, borderRadius: 22 },
  blurbContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  blurbCopy: { flex: 1, minWidth: 0, gap: 4 },
  blurbHeading: { color: colors.text, fontFamily: typefaces.display, fontSize: 20, lineHeight: 24 },
  blurbBody: { color: colors.text, fontFamily: typefaces.body, fontSize: 13, lineHeight: 18 },
  blurbRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  statCard: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  statValue: { color: colors.border, fontFamily: typefaces.display, fontSize: 28, lineHeight: 30, textAlign: "center" },
  statLabel: { color: colors.border, fontFamily: typefaces.body, fontSize: 10, lineHeight: 12, textAlign: "center" },
  nowPlayingPanel: { backgroundColor: "transparent", padding: 0, overflow: "hidden" },
  nowPlayingContent: { padding: 16, gap: 10, alignItems: "center" },
  controls: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 4 },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.button,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowLeft: { transform: [{ rotate: "90deg" }] },
  arrowRight: { transform: [{ rotate: "-90deg" }] },
  cdWrap: { width: 160, height: 160, alignItems: "center", justifyContent: "center", position: "relative" },
  cdBackdrop: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 12,
    backgroundColor: "rgba(212,224,249,0.18)",
  },
  cdImage: { width: 160, height: 160 },
  songName: {
    color: colors.textStrong,
    fontFamily: typefaces.display,
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center",
  },
  songArtist: { color: colors.text, fontFamily: typefaces.condensed, fontSize: 16, fontWeight: "700", textAlign: "center" },
  songUnderline: { width: "80%", height: 2, borderRadius: 2, backgroundColor: colors.accent, marginVertical: 2 },
  metaCard: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: "rgba(108,118,144,0.28)",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  metaLine: { color: colors.text, fontFamily: typefaces.condensed, fontSize: 14, lineHeight: 18 },
  metaLabelText: { color: colors.textStrong, fontFamily: typefaces.display, fontSize: 15, lineHeight: 18 },
  metaValueText: { color: colors.text },
  spotifyBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.button,
  },
  spotifyBtnText: { color: colors.border, fontFamily: typefaces.condensed, fontSize: 15, fontWeight: "800" },
  listPanel: { backgroundColor: "transparent", padding: 0, overflow: "hidden" },
  listContent: { padding: 16, gap: 8 },
  listTitle: { color: colors.textStrong, fontFamily: typefaces.display, fontSize: 20, lineHeight: 24, marginBottom: 4 },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.button,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
    minHeight: 54,
  },
  songRowSelected: { backgroundColor: "rgba(117,82,107,0.22)", borderColor: colors.accent },
  songRank: { color: colors.border, fontFamily: typefaces.display, fontSize: 14, minWidth: 22 },
  songTextBlock: { flex: 1, gap: 1 },
  songRowTitle: { color: colors.border, fontFamily: typefaces.display, fontSize: 14, lineHeight: 17 },
  songRowArtist: { color: colors.border, fontFamily: typefaces.condensed, fontSize: 11, lineHeight: 13, fontWeight: "700" },
  songTextActive: { color: colors.text },
  songCd: { width: 40, height: 40, borderRadius: 6, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  songCdImg: { width: 40, height: 40 },
});