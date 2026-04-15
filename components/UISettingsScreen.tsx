import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  Alert,
  PanResponder,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  setSkeletonSettings,
  setAllowAudioMixing,
  setShowExternalAudioControl,
  SMWorkoutLibrary,
} from '@sency/react-native-smkit-ui';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
const PRESETS = Object.values(SMWorkoutLibrary.SkeletonPreset);
const CONNECTION_STYLES = Object.values(SMWorkoutLibrary.SkeletonConnectionStyle);
const JOINT_SHAPES = Object.values(SMWorkoutLibrary.SkeletonJointShape);
const COLOR_OPTIONS = Object.values(SMWorkoutLibrary.SkeletonColorOption);

const PRESET_LABELS: Record<string, string> = {
  defaultPreset: 'Default', minimalDots: 'Minimal Dots', thinOutline: 'Thin Outline',
  monochromeClean: 'Monochrome Clean', neonGlow: 'Neon Glow', boldHighlight: 'Bold Highlight',
  softFill: 'Soft Fill', wireframe: 'Wireframe', highContrast: 'High Contrast',
  pastel: 'Pastel', darkOutline: 'Dark Outline', minimalLine: 'Minimal Line',
  doubleStroke: 'Double Stroke', gradientReady: 'Gradient Ready', subtleShadow: 'Subtle Shadow',
  classic: 'Classic', athletic: 'Athletic', premium: 'Premium', hologram: 'Hologram',
  matte: 'Matte', neonPulse: 'Neon Pulse', outlineOnly: 'Outline Only',
  slim: 'Slim', thick: 'Thick', studio: 'Studio', accessibility: 'Accessibility',
};

const CONNECTION_LABELS: Record<string, string> = {
  none: 'None', dotted: 'Dotted', dashed: 'Dashed', solid: 'Solid',
  longDashed: 'Long Dashed', thinDots: 'Thin Dots', dotDashed: 'Dot Dashed', rounded: 'Rounded',
};

const JOINT_LABELS: Record<string, string> = {
  circle: 'Circle', square: 'Square', triangle: 'Triangle',
  diamond: 'Diamond', star: 'Star', hexagon: 'Hexagon',
};

// Color values for the chips
const SKELETON_COLORS: Record<string, string> = {
  white: '#FFFFFF', black: '#000000', red: '#FF3B30', blue: '#007AFF',
  green: '#34C759', yellow: '#FFCC00', orange: '#FF9500', purple: '#AF52DE',
  gray: '#8E8E93', cyan: '#32ADE6', lightGray: '#D1D1D6', darkGray: '#48484A',
  offWhite: '#F2F2F7', charcoal: '#36454F', lightBlue: '#ADD8E6', darkBlue: '#00008B',
  lightGreen: '#90EE90', darkGreen: '#006400', lightPurple: '#DDA0DD', darkPurple: '#4B0082',
  gold: '#FFD700', darkGold: '#B8860B', lightPink: '#FFB6C1', darkPink: '#C71585',
  mediumGray: '#9E9E9E', silver: '#C0C0C0', navy: '#000080', forestGreen: '#228B22',
  lavender: '#E6E6FA', rosePink: '#FF66B2',
};

export type UISettingsResult = {
  skeletonConfig: SMWorkoutLibrary.SkeletonConfig;
  allowAudioMixing: boolean;
  showExternalAudioControl: boolean;
};

type Props = {
  initialConfig?: SMWorkoutLibrary.SkeletonConfig;
  onDone: (result: UISettingsResult) => void;
};

// ─────────────────────────────────────────────
// Custom Slider (no native deps)
// ─────────────────────────────────────────────
type SliderProps = {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (v: number) => void;
};

const CustomSlider = ({ value, min, max, label, onChange }: SliderProps) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const ratio = trackWidth > 0 ? (value - min) / (max - min) : 0;
  const thumbX = useRef(new Animated.Value(0)).current;
  const lastValue = useRef(value);

  useEffect(() => {
    if (trackWidth > 0) {
      thumbX.setValue(((value - min) / (max - min)) * trackWidth);
    }
  }, [trackWidth]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.locationX;
        const newRatio = Math.max(0, Math.min(1, x / trackWidth));
        const newVal = min + newRatio * (max - min);
        lastValue.current = newVal;
        thumbX.setValue(x);
        onChange(newVal);
      },
      onPanResponderMove: (e) => {
        const x = Math.max(0, Math.min(trackWidth, e.nativeEvent.locationX));
        const newRatio = x / trackWidth;
        const newVal = min + newRatio * (max - min);
        lastValue.current = newVal;
        thumbX.setValue(x);
        onChange(newVal);
      },
    })
  ).current;

  return (
    <View style={s.sliderRow}>
      <Text style={s.sliderLabel}>{label}</Text>
      <View
        style={s.sliderTrackContainer}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={s.sliderTrack}>
          <View style={[s.sliderFill, { width: `${ratio * 100}%` }]} />
        </View>
        <Animated.View
          style={[
            s.sliderThumb,
            { left: thumbX.interpolate({ inputRange: [0, trackWidth || 1], outputRange: [0, trackWidth || 1], extrapolate: 'clamp' }) },
          ]}
          pointerEvents="none"
        />
      </View>
      <Text style={s.sliderValue}>{value.toFixed(2)}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────
// Mini skeleton preview (View-based)
// ─────────────────────────────────────────────
const MiniPreview = ({ preset, connectionStyle, jointShape, dotsInnerColor, connectionsInnerColor, lineWidthScale }: {
  preset: string; connectionStyle: string; jointShape: string;
  dotsInnerColor?: string | null; connectionsInnerColor?: string | null; lineWidthScale: number;
}) => {
  const dotColor = dotsInnerColor ? SKELETON_COLORS[dotsInnerColor] ?? '#fff' : '#fff';
  const lineColor = connectionsInnerColor ? SKELETON_COLORS[connectionsInnerColor] ?? '#4CD964' : '#4CD964';
  const lw = Math.max(1, Math.min(4, 1.5 * lineWidthScale));

  const joints = [
    { left: 4, top: 10 },
    { left: 20, top: 2 },
    { left: 36, top: 10 },
  ];

  const DotShape = ({ left, top }: { left: number; top: number }) => {
    const size = 6;
    const base: any = {
      position: 'absolute' as const,
      width: size, height: size,
      backgroundColor: dotColor,
      left, top,
    };
    if (jointShape === 'circle') base.borderRadius = size / 2;
    if (jointShape === 'diamond') {
      return (
        <View style={[base, { transform: [{ rotate: '45deg' }] }]} />
      );
    }
    return <View style={base} />;
  };

  const lineStyle: any = {
    position: 'absolute' as const,
    backgroundColor: connectionStyle === 'none' ? 'transparent' : lineColor,
    height: lw,
    borderRadius: 1,
  };

  return (
    <View style={{ width: 52, height: 28, backgroundColor: '#111', borderRadius: 4, overflow: 'hidden' }}>
      {connectionStyle !== 'none' && (
        <>
          <View style={[lineStyle, { left: 7, top: 13, width: 15, transform: [{ rotate: '-28deg' }] }]} />
          <View style={[lineStyle, { left: 23, top: 8, width: 15, transform: [{ rotate: '28deg' }] }]} />
        </>
      )}
      {joints.map((j, i) => <DotShape key={i} left={j.left} top={j.top} />)}
    </View>
  );
};

const ColorChips = ({ selected, onSelect }: {
  selected: string | null;
  onSelect: (color: string | null) => void;
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
    <Pressable
      style={[s.colorChip, { backgroundColor: '#AAA' }, selected === null && s.colorChipSelected]}
      onPress={() => onSelect(null)}
    >
      <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>P</Text>
    </Pressable>
    {COLOR_OPTIONS.map((opt) => (
      <Pressable
        key={opt}
        style={[
          s.colorChip,
          { backgroundColor: SKELETON_COLORS[opt] ?? '#888' },
          selected === opt && s.colorChipSelected,
        ]}
        onPress={() => onSelect(opt)}
      />
    ))}
  </ScrollView>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={s.sectionHeader}>{title}</Text>
);

const ToggleRow = ({ label, subtitle, value, onChanged }: {
  label: string; subtitle: string; value: boolean; onChanged: (v: boolean) => void;
}) => (
  <View style={s.toggleRow}>
    <View style={{ flex: 1 }}>
      <Text style={s.toggleLabel}>{label}</Text>
      {subtitle ? <Text style={s.toggleSubtitle}>{subtitle}</Text> : null}
    </View>
    <Switch value={value} onValueChange={onChanged} />
  </View>
);

const SelectRow = ({ label, preview, selected, onPress }: {
  label: string; preview: React.ReactNode; selected: boolean; onPress: () => void;
}) => (
  <Pressable style={[s.selectRow, selected && s.selectRowSelected]} onPress={onPress}>
    {preview}
    <Text style={[s.selectRowLabel, selected && { fontWeight: '600' }]}>{label}</Text>
    <View style={{ flex: 1 }} />
    {selected && <Text style={s.checkmark}>✓</Text>}
  </Pressable>
);

const UISettingsScreen = ({ initialConfig, onDone }: Props) => {
  const [allowAudioMixing, setAllowAudioMixing] = useState(false);
  const [showExternalAudioControl, setShowExternalAudioControl] = useState(false);

  const [hidden, setHidden] = useState(initialConfig?.hidden ?? false);
  const [preset, setPreset] = useState<string>(initialConfig?.preset ?? SMWorkoutLibrary.SkeletonPreset.Default);
  const [connectionStyle, setConnectionStyle] = useState<string>(initialConfig?.connectionStyle ?? SMWorkoutLibrary.SkeletonConnectionStyle.Solid);
  const [jointShape, setJointShape] = useState<string>(initialConfig?.jointShape ?? SMWorkoutLibrary.SkeletonJointShape.Circle);
  const [dotsOpacity, setDotsOpacity] = useState(initialConfig?.dotsOpacity ?? 1.0);
  const [connectionsOpacity, setConnectionsOpacity] = useState(initialConfig?.connectionsOpacity ?? 1.0);
  const [dotsGlow, setDotsGlow] = useState(initialConfig?.dotsGlow ?? 0.0);
  const [connectionsGlow, setConnectionsGlow] = useState(initialConfig?.connectionsGlow ?? 0.0);
  const [lineWidthScale, setLineWidthScale] = useState(initialConfig?.lineWidthScale ?? 1.0);
  const [outlineScale, setOutlineScale] = useState(initialConfig?.outlineScale ?? 1.0);
  const [softness, setSoftness] = useState(initialConfig?.softness ?? 0.0);
  const [dotsInnerColor, setDotsInnerColor] = useState<string | null>(initialConfig?.dotsInnerColor ?? null);
  const [dotsOuterColor, setDotsOuterColor] = useState<string | null>(initialConfig?.dotsOuterColor ?? null);
  const [connectionsInnerColor, setConnectionsInnerColor] = useState<string | null>(initialConfig?.connectionsInnerColor ?? null);
  const [connectionsOuterColor, setConnectionsOuterColor] = useState<string | null>(initialConfig?.connectionsOuterColor ?? null);

  const buildConfig = (): SMWorkoutLibrary.SkeletonConfig => ({
    hidden,
    preset: preset as SMWorkoutLibrary.SkeletonPreset,
    connectionStyle: connectionStyle as SMWorkoutLibrary.SkeletonConnectionStyle,
    jointShape: jointShape as SMWorkoutLibrary.SkeletonJointShape,
    dotsOpacity,
    connectionsOpacity,
    dotsGlow,
    connectionsGlow,
    lineWidthScale,
    outlineScale,
    softness,
    ...(dotsInnerColor ? { dotsInnerColor: dotsInnerColor as SMWorkoutLibrary.SkeletonColorOption } : {}),
    ...(dotsOuterColor ? { dotsOuterColor: dotsOuterColor as SMWorkoutLibrary.SkeletonColorOption } : {}),
    ...(connectionsInnerColor ? { connectionsInnerColor: connectionsInnerColor as SMWorkoutLibrary.SkeletonColorOption } : {}),
    ...(connectionsOuterColor ? { connectionsOuterColor: connectionsOuterColor as SMWorkoutLibrary.SkeletonColorOption } : {}),
  });

  const handleApply = async () => {
    try {
      const config = buildConfig();
      await setSkeletonSettings(config);
      if (Platform.OS !== 'android') {
        await setAllowAudioMixing(allowAudioMixing);
      }
      if (Platform.OS !== 'android') {
        await setShowExternalAudioControl(showExternalAudioControl);
      }
      onDone({
        skeletonConfig: config,
        allowAudioMixing,
        showExternalAudioControl,
      });
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>UI Settings</Text>
        <Pressable onPress={handleApply} style={s.applyBtn}>
          <Text style={s.applyBtnText}>Apply</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent}>
        <SectionHeader title="Session" />
        {Platform.OS !== 'android' && (
          <ToggleRow
            label="Allow Audio Mixing"
            subtitle="Mix workout audio with external apps"
            value={allowAudioMixing}
            onChanged={setAllowAudioMixing}
          />
        )}
        {Platform.OS !== 'android' && (
          <ToggleRow
            label="Show External Audio Control"
            subtitle="Display in-session audio source button"
            value={showExternalAudioControl}
            onChanged={setShowExternalAudioControl}
          />
        )}

        <View style={s.divider} />

        <SectionHeader title="Skeleton" />
        <View style={s.livePreview}>
          <Text style={s.livePreviewLabel}>Preview</Text>
          <MiniPreview
            preset={preset}
            connectionStyle={connectionStyle}
            jointShape={jointShape}
            dotsInnerColor={dotsInnerColor}
            connectionsInnerColor={connectionsInnerColor}
            lineWidthScale={lineWidthScale}
          />
        </View>

        <View style={s.toggleRow}>
          <Text style={[s.toggleLabel, { fontWeight: '600' }]}>Hide skeleton</Text>
          <Switch value={hidden} onValueChange={setHidden} />
        </View>

        <SectionHeader title="Preset" />
        {PRESETS.map((p) => (
          <SelectRow
            key={p}
            label={PRESET_LABELS[p] ?? p}
            selected={preset === p}
            preview={
              <MiniPreview
                preset={p} connectionStyle={connectionStyle} jointShape={jointShape}
                dotsInnerColor={dotsInnerColor} connectionsInnerColor={connectionsInnerColor}
                lineWidthScale={lineWidthScale}
              />
            }
            onPress={() => setPreset(p)}
          />
        ))}

        <SectionHeader title="Connection Style" />
        {CONNECTION_STYLES.map((c) => (
          <SelectRow
            key={c}
            label={CONNECTION_LABELS[c] ?? c}
            selected={connectionStyle === c}
            preview={
              <MiniPreview
                preset={preset} connectionStyle={c} jointShape={jointShape}
                dotsInnerColor={dotsInnerColor} connectionsInnerColor={connectionsInnerColor}
                lineWidthScale={lineWidthScale}
              />
            }
            onPress={() => setConnectionStyle(c)}
          />
        ))}

        <SectionHeader title="Joint Shape" />
        {JOINT_SHAPES.map((j) => (
          <SelectRow
            key={j}
            label={JOINT_LABELS[j] ?? j}
            selected={jointShape === j}
            preview={
              <MiniPreview
                preset={preset} connectionStyle={connectionStyle} jointShape={j}
                dotsInnerColor={dotsInnerColor} connectionsInnerColor={connectionsInnerColor}
                lineWidthScale={lineWidthScale}
              />
            }
            onPress={() => setJointShape(j)}
          />
        ))}

        <SectionHeader title="Dots Glow" />
        <CustomSlider value={dotsGlow} min={0} max={1} label="0 — 1" onChange={setDotsGlow} />
        <SectionHeader title="Connections Glow" />
        <CustomSlider value={connectionsGlow} min={0} max={1} label="0 — 1" onChange={setConnectionsGlow} />
        <SectionHeader title="Line Width Scale" />
        <CustomSlider value={lineWidthScale} min={0.5} max={2} label="0.5 — 2" onChange={setLineWidthScale} />
        <SectionHeader title="Outline Scale" />
        <CustomSlider value={outlineScale} min={0.5} max={2} label="0.5 — 2" onChange={setOutlineScale} />
        <SectionHeader title="Softness" />
        <CustomSlider value={softness} min={0} max={1} label="0 — 1" onChange={setSoftness} />
        <SectionHeader title="Dots Opacity" />
        <CustomSlider value={dotsOpacity} min={0} max={1} label="0 — 1" onChange={setDotsOpacity} />
        <SectionHeader title="Dots Inner Color" />
        <ColorChips selected={dotsInnerColor} onSelect={setDotsInnerColor} />
        <SectionHeader title="Dots Outer Color" />
        <ColorChips selected={dotsOuterColor} onSelect={setDotsOuterColor} />
        <SectionHeader title="Connections Opacity" />
        <CustomSlider value={connectionsOpacity} min={0} max={1} label="0 — 1" onChange={setConnectionsOpacity} />
        <SectionHeader title="Connections Inner Color" />
        <ColorChips selected={connectionsInnerColor} onSelect={setConnectionsInnerColor} />
        <SectionHeader title="Connections Outer Color" />
        <ColorChips selected={connectionsOuterColor} onSelect={setConnectionsOuterColor} />

        <Pressable style={s.applyCloseBtn} onPress={handleApply}>
          <Text style={s.applyCloseBtnText}>Apply & Close</Text>
        </Pressable>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  applyBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  sectionHeader: {
    fontSize: 14, fontWeight: '600', color: '#6C6C70',
    marginTop: 12, marginBottom: 4, textTransform: 'uppercase',
  },
  divider: { height: 1, backgroundColor: '#D1D1D6', marginVertical: 12 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 2,
  },
  toggleLabel: { fontSize: 15, color: '#000' },
  toggleSubtitle: { fontSize: 12, color: '#6C6C70', marginTop: 2 },
  livePreview: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1C1C1E', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8,
    gap: 16,
  },
  livePreviewLabel: { color: '#EBEBF5', fontSize: 13, opacity: 0.7 },
  selectRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#D1D1D6',
    gap: 12, minHeight: 44,
  },
  selectRowSelected: { backgroundColor: '#EBF3FF' },
  selectRowLabel: { fontSize: 15, color: '#000' },
  checkmark: { color: '#007AFF', fontSize: 17, fontWeight: '600' },
  sliderRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 2, gap: 8,
  },
  sliderLabel: { fontSize: 12, color: '#6C6C70', width: 52 },
  sliderTrackContainer: { flex: 1, height: 44, justifyContent: 'center' },
  sliderTrack: { height: 4, backgroundColor: '#D1D1D6', borderRadius: 2, overflow: 'hidden' },
  sliderFill: { height: 4, backgroundColor: '#007AFF', borderRadius: 2 },
  sliderThumb: {
    position: 'absolute', width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#007AFF', top: '50%', marginTop: -11, marginLeft: -11,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3, shadowRadius: 2, elevation: 3,
  },
  sliderValue: { fontSize: 12, color: '#6C6C70', width: 36, textAlign: 'right' },
  colorChip: {
    width: 36, height: 36, borderRadius: 18,
    marginHorizontal: 4, marginVertical: 6,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)',
  },
  colorChipSelected: { borderWidth: 3, borderColor: '#007AFF' },
  applyCloseBtn: {
    backgroundColor: '#007AFF', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 24,
  },
  applyCloseBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});

export default UISettingsScreen;
