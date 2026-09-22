import type {
  ColorSelectionTarget,
  ColorSwatch,
  GeneratedThemeModeColors,
  GeneratedThemeSwatches,
  HexColor,
  SemanticColorReferenceMap,
  SemanticColorToken,
  ThemeColorMode,
} from '@ankhorage/color-theory';
import { createDefaultSemanticStatusSwatches } from '@ankhorage/color-theory';

import type {
  BorderSemantics,
  ContentSemantics,
  RoleSemantics,
  SurfaceColorDiagnostics,
  ThemeSemantics,
} from '../../../types/theme';
import { createSurfaceColorDiagnosticCollector } from './createSurfaceColorDiagnosticCollector';
import { createSurfaceSemanticPolicy } from './createSurfaceSemanticPolicy';
import { resolveRoleSemantics } from './resolveRoleSemantics';

type ResolvedSemanticColors = Record<SemanticColorToken, HexColor>;

interface SemanticResolutionContext {
  collector: ReturnType<typeof createSurfaceColorDiagnosticCollector>;
  generated: GeneratedThemeModeColors;
  isDark: boolean;
  mode: ThemeColorMode;
  neutralSwatch: ColorSwatch;
  policy: ReturnType<typeof createSurfaceSemanticPolicy>;
  quaternarySwatch: ColorSwatch;
  references: SemanticColorReferenceMap;
  resolved: ResolvedSemanticColors;
  secondarySwatch: ColorSwatch;
  statusSwatches: ReturnType<typeof createDefaultSemanticStatusSwatches>;
  swatches: GeneratedThemeSwatches;
  tertiarySwatch: ColorSwatch;
}

interface ResolveSurfaceSemanticModelInput {
  generated: GeneratedThemeModeColors;
  mode: ThemeColorMode;
  references: SemanticColorReferenceMap;
  resolved: ResolvedSemanticColors;
}

/** Resolve the complete Surface-owned semantic model from canonical Color Theory output. */
export function resolveSurfaceSemanticModel(input: ResolveSurfaceSemanticModelInput): {
  semantics: ThemeSemantics;
  colorDiagnostics: SurfaceColorDiagnostics;
} {
  const context = createResolutionContext(input);
  const roles = resolveSemanticRoles(context);
  const inverseSurface = context.isDark ? context.neutralSwatch[50] : context.neutralSwatch[900];
  const inverseContent = context.isDark ? context.neutralSwatch[900] : context.neutralSwatch[50];
  const neutral = context.policy.buildNeutral(context.neutralSwatch);
  const surface = context.policy.buildSurface(inverseSurface);
  const content = resolveContentSemantics(context, neutral.textSubtle, inverseContent);
  const border = resolveBorderSemantics(context, roles.brand.outline);
  context.policy.measureContent(content, surface);

  return {
    semantics: {
      neutral,
      brand: roles.brand,
      secondary: roles.secondary,
      accent: roles.accent,
      highlight: roles.highlight,
      danger: roles.danger,
      success: roles.success,
      warning: roles.warning,
      error: roles.danger,
      info: roles.info,
      surface,
      content,
      border,
      selection: {
        background: roles.brand.softBg,
        content: roles.brand.onSoftText,
        border: border.focus,
      },
      action: { primary: roles.brand, neutral: roles.neutralAction, danger: roles.danger },
    },
    colorDiagnostics: {
      mode: context.mode,
      generated: context.generated,
      semanticReferences: context.references,
      statusSwatches: context.statusSwatches.diagnostics,
      selections: context.collector.selections,
      contrasts: context.collector.contrasts,
      surfaceSeparation: context.policy.measureSurfaceSeparation(surface),
    },
  };
}

function createResolutionContext(
  input: ResolveSurfaceSemanticModelInput,
): SemanticResolutionContext {
  const { generated, mode, references, resolved } = input;
  const { swatches } = generated;
  const collector = createSurfaceColorDiagnosticCollector();
  const isDark = mode === 'dark';
  return {
    collector,
    generated,
    isDark,
    mode,
    neutralSwatch: swatches.neutral,
    policy: createSurfaceSemanticPolicy(resolved, isDark, collector),
    quaternarySwatch: swatches.quaternary ?? swatches.primary,
    references,
    resolved,
    secondarySwatch: swatches.secondary ?? swatches.primary,
    statusSwatches: createDefaultSemanticStatusSwatches(),
    swatches,
    tertiarySwatch: swatches.tertiary ?? swatches.primary,
  };
}

function resolveBorderSemantics(
  context: SemanticResolutionContext,
  focus: string,
): BorderSemantics {
  const { collector, neutralSwatch, policy, resolved } = context;
  return {
    default: collector.selectColor(
      'border.default',
      neutralSwatch,
      policy.neutralTarget(),
      policy.adjacentSurfaceContexts,
      policy.tiePolicy,
    ),
    subtle: resolved.border,
    strong: collector.selectColor(
      'border.strong',
      neutralSwatch,
      policy.strongNeutralTarget(),
      policy.adjacentSurfaceContexts,
      policy.tiePolicy,
    ),
    divider: resolved.divider,
    focus,
  };
}

function resolveContentSemantics(
  context: SemanticResolutionContext,
  subtle: string,
  inverse: string,
): ContentSemantics {
  const { collector, policy, resolved, secondarySwatch, swatches } = context;
  return {
    default: resolved.text,
    muted: resolved.textMuted,
    subtle,
    disabled: resolved.disabledText,
    icon: resolved.text,
    link: collector.selectColor(
      'content.link',
      swatches.primary,
      policy.textTarget(),
      policy.textSurfaceContexts,
      policy.tiePolicy,
    ),
    visited: collector.selectColor(
      'content.visited',
      secondarySwatch,
      policy.textTarget(),
      policy.textSurfaceContexts,
      policy.tiePolicy,
    ),
    inverse,
  };
}

function resolveRole(
  context: SemanticResolutionContext,
  id: string,
  swatch: ColorSwatch,
  options: { base?: HexColor; hover?: HexColor; target?: ColorSelectionTarget } = {},
): RoleSemantics {
  const { collector, isDark, policy, resolved } = context;
  return resolveRoleSemantics({
    base: options.base,
    disabledBg: resolved.disabledBg,
    disabledText: resolved.disabledText,
    hover: options.hover,
    id,
    isDark,
    measureForeground: collector.measureForeground,
    onSurfaceText: collector.selectColor(
      `${id}.content`,
      swatch,
      policy.textTarget(),
      policy.textSurfaceContexts,
      policy.tiePolicy,
    ),
    outline: collector.selectColor(
      `${id}.outline`,
      swatch,
      options.target ?? policy.roleTarget(),
      policy.adjacentSurfaceContexts,
      policy.tiePolicy,
    ),
    selectForeground: collector.selectForeground,
    swatch,
  });
}

function resolveSemanticRoles(context: SemanticResolutionContext) {
  const { neutralSwatch, resolved, secondarySwatch, statusSwatches, swatches } = context;
  return {
    brand: resolveRole(context, 'brand', swatches.primary, {
      base: resolved.action,
      hover: resolved.actionEmphasis,
    }),
    secondary: resolveRole(context, 'secondary', secondarySwatch),
    accent: resolveRole(context, 'accent', context.tertiarySwatch),
    highlight: resolveRole(context, 'highlight', context.quaternarySwatch),
    danger: resolveRole(context, 'danger', statusSwatches.swatches.danger),
    success: resolveRole(context, 'success', statusSwatches.swatches.success),
    warning: resolveRole(context, 'warning', statusSwatches.swatches.warning),
    info: resolveRole(context, 'info', statusSwatches.swatches.info),
    neutralAction: resolveRole(context, 'neutral', neutralSwatch, {
      target: context.policy.neutralTarget(),
    }),
  };
}
