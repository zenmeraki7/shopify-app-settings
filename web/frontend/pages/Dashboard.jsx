import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Banner,
  SkeletonBodyText,
  SkeletonDisplayText,
  Divider,
  ResourceList,
  ResourceItem,
  Icon,
  Box,
  ProgressBar,
  Link,
} from "@shopify/polaris";

import { useAppBridge } from "@shopify/app-bridge-react";
import { Toast } from "@shopify/app-bridge/actions";

// ✅ Polaris Icons v9 uses *Icon exports
import {
  ExternalIcon,
  SettingsIcon,
  ChartLineIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "@shopify/polaris-icons";

// ✅ Authenticated fetch for embedded apps
import { useAuthFetch } from "../hooks/useAuthFetch";

const DAYS = 30;

export default function Dashboard() {
  const app = useAppBridge();
  const authFetch = useAuthFetch();

  const [toastRef, setToastRef] = useState(null);
  const showToast = useCallback(
    (message, isError = false) => {
      try {
        toastRef?.dispatch(Toast.Action.CLEAR);
      } catch (_) {}
      const t = Toast.create(app, { message, duration: 3500, isError });
      t.dispatch(Toast.Action.SHOW);
      setToastRef(t);
    },
    [app, toastRef]
  );

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [settings, setSettings] = useState(null);
  const [subscription, setSubscription] = useState({
    active: null,
    planName: null,
  });
  const [analytics, setAnalytics] = useState(null); // optional

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);

      try {
        const [settingsRes, subRes, analyticsRes] = await Promise.allSettled([
          authFetch("/api/settings/share-buttons", { method: "GET" }),
          authFetch("/api/verify-subscription", { method: "GET" }),
          authFetch(`/api/analytics/share-buttons/summary?days=${DAYS}`, {
            method: "GET",
          }),
        ]);

        // Settings
        if (
          settingsRes.status === "fulfilled" &&
          settingsRes.value &&
          settingsRes.value.ok
        ) {
          const data = await settingsRes.value.json();
          if (!cancelled) setSettings(data?.settings || null);
        } else {
          if (!cancelled) setSettings(null);
        }

        // Subscription
        if (subRes.status === "fulfilled" && subRes.value && subRes.value.ok) {
          const data = await subRes.value.json();
          if (!cancelled) {
            setSubscription({
              active: !!data?.active,
              planName:
                data?.activePlan?.name || (data?.active ? "Active plan" : null),
            });
          }
        } else {
          if (!cancelled) setSubscription({ active: null, planName: null });
        }

        // Analytics (optional)
        if (
          analyticsRes.status === "fulfilled" &&
          analyticsRes.value &&
          analyticsRes.value.ok
        ) {
          const data = await analyticsRes.value.json();
          if (!cancelled) setAnalytics(data || null);
        } else {
          if (!cancelled) setAnalytics(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message || "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authFetch]);

  const status = useMemo(() => deriveStatus(settings), [settings]);

  const quickActions = useMemo(
    () => [
      {
        id: "builder",
        label: "Edit Share Buttons",
        icon: SettingsIcon,
        primary: true,
        onAction: () => (window.location.href = "/app/share-buttons"),
      },
      {
        id: "theme",
        label: "Open Theme Editor",
        icon: ExternalIcon,
        onAction: () => openThemeEditorTopFrame(),
      },
      {
        id: "analytics",
        label: "View Analytics",
        icon: ChartLineIcon,
        onAction: () => (window.location.href = "/app/analytics"),
      },
    ],
    []
  );

  const installationChecklist = useMemo(() => {
    const enabled = settings?.enabled === true;
    const hasPlatforms = settings?.platforms
      ? Object.values(settings.platforms).some(Boolean)
      : false;

    return [
      {
        key: "appEnabled",
        label: "Share buttons enabled",
        state: enabled ? "ok" : "warn",
        actionLabel: enabled ? "View settings" : "Enable",
        onAction: () => (window.location.href = "/app/share-buttons"),
        help: enabled
          ? "Buttons are enabled in app settings."
          : "Enable buttons to show on storefront.",
      },
      {
        key: "platforms",
        label: "At least one platform enabled",
        state: hasPlatforms ? "ok" : "warn",
        actionLabel: "Edit platforms",
        onAction: () => (window.location.href = "/app/share-buttons"),
        help: hasPlatforms ? "Platforms selected." : "Enable share destinations.",
      },
      {
        key: "themeEmbed",
        label: "App embed enabled in theme",
        state: "unknown",
        actionLabel: "Open Theme Editor",
        onAction: () => openThemeEditorTopFrame(),
        help: "Enable the app embed to activate storefront rendering.",
      },
      {
        key: "blockAdded",
        label: "Block added on product template",
        state: "unknown",
        actionLabel: "Open Theme Editor",
        onAction: () => openThemeEditorTopFrame(),
        help: "Add the block to the product page where you want buttons to appear.",
      },
    ];
  }, [settings]);

  const completionPct = useMemo(() => {
    const known = installationChecklist.filter((x) => x.state !== "unknown");
    if (known.length === 0) return 25;
    const ok = known.filter((x) => x.state === "ok").length;
    return Math.max(10, Math.round((ok / installationChecklist.length) * 100));
  }, [installationChecklist]);

  const recentActivity = useMemo(() => {
    const items = [];
    if (settings)
      items.push({
        id: "settings",
        title: "Settings synced",
        detail: "Dashboard is using your saved configuration.",
      });
    if (subscription.active === true)
      items.push({
        id: "plan",
        title: "Plan active",
        detail: subscription.planName || "Active plan detected.",
      });
    if (subscription.active === false)
      items.push({
        id: "plan2",
        title: "Plan inactive",
        detail: "Upgrade to unlock premium options (if applicable).",
      });
    return items.slice(0, 6);
  }, [settings, subscription]);

  return (
    <Page
      title="Dashboard"
      subtitle="Monitor status, installation, and performance at a glance."
      primaryAction={{
        content: "Edit Share Buttons",
        onAction: () => (window.location.href = "/app/share-buttons"),
      }}
      secondaryActions={[
        {
          content: "Open Theme Editor",
          onAction: () => openThemeEditorTopFrame(),
        },
      ]}
    >
      {loadError ? (
        <Layout>
          <Layout.Section>
            <Banner
              tone="critical"
              title="Couldn’t load dashboard"
              action={{ content: "Retry", onAction: () => window.location.reload() }}
            >
              <p>{loadError}</p>
            </Banner>
          </Layout.Section>
        </Layout>
      ) : null}

      <Layout>
        {/* Left column */}
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Status overview
                  </Text>
                  {loading ? (
                    <Badge tone="info">Loading</Badge>
                  ) : status.tone === "success" ? (
                    <Badge tone="success">Healthy</Badge>
                  ) : status.tone === "critical" ? (
                    <Badge tone="critical">Action needed</Badge>
                  ) : (
                    <Badge tone="warning">Review</Badge>
                  )}
                </InlineStack>

                {loading ? (
                  <>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={2} />
                  </>
                ) : (
                  <BlockStack gap="200">
                    <InlineStack gap="200" wrap>
                      <Badge tone={settings?.enabled ? "success" : "critical"}>
                        {settings?.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Badge tone={settings?.buttonStyle ? "info" : "warning"}>
                        Style: {humanizeButtonStyle(settings?.buttonStyle)}
                      </Badge>
                      <Badge tone={settings?.placement ? "info" : "warning"}>
                        Placement: {humanizePlacement(settings?.placement)}
                      </Badge>
                      <Badge tone={settings?.stickyOnScroll ? "success" : "info"}>
                        Sticky: {settings?.stickyOnScroll ? "On" : "Off"}
                      </Badge>
                      <Badge tone={settings?.mobileOnly ? "warning" : "info"}>
                        Mobile-only: {settings?.mobileOnly ? "On" : "Off"}
                      </Badge>
                      <Badge
                        tone={
                          subscription.active === true
                            ? "success"
                            : subscription.active === false
                            ? "critical"
                            : "info"
                        }
                      >
                        Plan:{" "}
                        {subscription.active === true
                          ? subscription.planName || "Active"
                          : subscription.active === false
                          ? "Inactive"
                          : "Unknown"}
                      </Badge>
                    </InlineStack>

                    {status.banner ? (
                      <Banner
                        tone={status.banner.tone}
                        title={status.banner.title}
                        action={status.banner.action}
                      >
                        <p>{status.banner.body}</p>
                      </Banner>
                    ) : null}
                  </BlockStack>
                )}

                <Divider />

                <InlineStack gap="200" wrap>
                  {quickActions.map((a) => (
                    <Button
                      key={a.id}
                      primary={a.primary}
                      icon={a.icon}
                      onClick={a.onAction}
                    >
                      {a.label}
                    </Button>
                  ))}
                </InlineStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Performance snapshot (last {DAYS} days)
                  </Text>
                  <Button
                    icon={ChartLineIcon}
                    onClick={() => (window.location.href = "/app/analytics")}
                    plain
                  >
                    View
                  </Button>
                </InlineStack>

                {loading ? (
                  <>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={3} />
                  </>
                ) : analytics ? (
                  <InlineStack gap="600" wrap>
                    <Metric label="Total share clicks" value={formatInt(analytics.clicksTotal)} />
                    <Metric
                      label="Top platform"
                      value={analytics.topPlatform ? humanizePlatform(analytics.topPlatform) : "—"}
                    />
                    <Metric
                      label="Mobile share"
                      value={
                        Number.isFinite(analytics.mobilePct)
                          ? `${Math.round(analytics.mobilePct)}%`
                          : "—"
                      }
                    />
                    <Metric label="Enabled platforms" value={formatInt(countEnabledPlatforms(settings))} />
                  </InlineStack>
                ) : (
                  <Banner
                    tone="info"
                    title="Analytics not connected yet"
                    action={{
                      content: "Enable analytics",
                      onAction: () =>
                        showToast("Connect /api/analytics/share-buttons/summary to show metrics"),
                    }}
                  >
                    <p>
                      Add a lightweight click tracking endpoint to unlock charts,
                      top platforms, and product-level insights.
                    </p>
                  </Banner>
                )}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    Recent activity
                  </Text>
                  <Button plain onClick={() => showToast("Wire this to logs later")}>
                    Manage
                  </Button>
                </InlineStack>

                {loading ? (
                  <SkeletonBodyText lines={4} />
                ) : recentActivity.length ? (
                  <ResourceList
                    resourceName={{ singular: "event", plural: "events" }}
                    items={recentActivity}
                    renderItem={(item) => (
                      <ResourceItem id={item.id} accessibilityLabel={item.title}>
                        <BlockStack gap="100">
                          <Text as="h3" variant="bodyMd" fontWeight="semibold">
                            {item.title}
                          </Text>
                          <Text as="p" tone="subdued">
                            {item.detail}
                          </Text>
                        </BlockStack>
                      </ResourceItem>
                    )}
                  />
                ) : (
                  <Text as="p" tone="subdued">
                    No recent activity yet.
                  </Text>
                )}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Right column */}
        <Layout.Section secondary>
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Installation status
                </Text>

                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" tone="subdued">
                      Complete setup to activate storefront buttons.
                    </Text>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      {completionPct}%
                    </Text>
                  </InlineStack>
                  <ProgressBar progress={completionPct} size="small" />
                </BlockStack>

                <Divider />

                <BlockStack gap="200">
                  {installationChecklist.map((row) => (
                    <ChecklistRow
                      key={row.key}
                      label={row.label}
                      help={row.help}
                      state={row.state}
                      actionLabel={row.actionLabel}
                      onAction={row.onAction}
                    />
                  ))}
                </BlockStack>

                <Divider />

                <Box paddingBlockStart="100">
                  <Text as="p" tone="subdued">
                    Need help?{" "}
                    <Link removeUnderline onClick={() => showToast("Add your support link")}>
                      Contact support
                    </Link>
                  </Text>
                </Box>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Recommended next steps
                </Text>

                <BlockStack gap="200">
                  <Recommendation
                    title="Enable Floating bar for mobile conversion"
                    body="Floating bar keeps share options visible while scrolling on product pages."
                    actionLabel="Apply in Builder"
                    onAction={() => (window.location.href = "/app/share-buttons")}
                  />
                  <Recommendation
                    title="Reduce clutter: enable 3–5 platforms"
                    body="Too many buttons can reduce clicks. Start with WhatsApp, Instagram, Email, Copy."
                    actionLabel="Edit platforms"
                    onAction={() => (window.location.href = "/app/share-buttons")}
                  />
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

/* =========================
   Small UI primitives
========================= */

function Metric({ label, value }) {
  return (
    <BlockStack gap="100">
      <Text as="p" tone="subdued">
        {label}
      </Text>
      <Text as="p" variant="headingLg">
        {value}
      </Text>
    </BlockStack>
  );
}

function ChecklistRow({ label, help, state, actionLabel, onAction }) {
  const iconSource = state === "ok" ? CheckCircleIcon : AlertCircleIcon;
  const iconTone =
    state === "ok"
      ? "success"
      : state === "warn"
      ? "warning"
      : state === "critical"
      ? "critical"
      : "subdued";

  const badgeTone =
    state === "ok"
      ? "success"
      : state === "warn"
      ? "warning"
      : state === "critical"
      ? "critical"
      : "info";

  return (
    <Box padding="200" borderColor="border" borderWidth="025" borderRadius="200">
      <InlineStack align="space-between" blockAlign="start" gap="200" wrap={false}>
        <InlineStack gap="200" wrap={false}>
          <Icon source={iconSource} tone={iconTone} />
          <BlockStack gap="50">
            <Text as="p" fontWeight="semibold">
              {label}
            </Text>
            <Text as="p" tone="subdued">
              {help}
            </Text>
            <Badge tone={badgeTone}>
              {state === "ok"
                ? "Done"
                : state === "warn"
                ? "Needs attention"
                : state === "critical"
                ? "Blocked"
                : "Check"}
            </Badge>
          </BlockStack>
        </InlineStack>

        <div style={{ flexShrink: 0 }}>
          <Button onClick={onAction} size="slim">
            {actionLabel}
          </Button>
        </div>
      </InlineStack>
    </Box>
  );
}

function Recommendation({ title, body, actionLabel, onAction }) {
  return (
    <Box padding="200" borderColor="border" borderWidth="025" borderRadius="200">
      <BlockStack gap="150">
        <Text as="h3" variant="headingSm">
          {title}
        </Text>
        <Text as="p" tone="subdued">
          {body}
        </Text>
        <InlineStack>
          <Button onClick={onAction} size="slim" variant="primary">
            {actionLabel}
          </Button>
        </InlineStack>
      </BlockStack>
    </Box>
  );
}

/* =========================
   Helpers
========================= */

function deriveStatus(settings) {
  if (!settings) {
    return {
      tone: "warning",
      banner: {
        tone: "warning",
        title: "Settings not found",
        body: "We couldn’t load share button settings. Check app permissions or try again.",
        action: {
          content: "Open settings",
          onAction: () => (window.location.href = "/app/share-buttons"),
        },
      },
    };
  }

  const enabled = settings.enabled === true;
  const anyPlatform = settings.platforms
    ? Object.values(settings.platforms).some(Boolean)
    : false;

  if (!enabled) {
    return {
      tone: "critical",
      banner: {
        tone: "critical",
        title: "Share buttons are disabled",
        body: "Enable share buttons to show them on your storefront product pages.",
        action: {
          content: "Enable in settings",
          onAction: () => (window.location.href = "/app/share-buttons"),
        },
      },
    };
  }

  if (!anyPlatform) {
    return {
      tone: "warning",
      banner: {
        tone: "warning",
        title: "No platforms enabled",
        body: "Enable at least one platform (WhatsApp, Instagram, Email, etc.) to display buttons.",
        action: {
          content: "Edit platforms",
          onAction: () => (window.location.href = "/app/share-buttons"),
        },
      },
    };
  }

  return { tone: "success", banner: null };
}

function countEnabledPlatforms(settings) {
  const p = settings?.platforms;
  if (!p) return 0;
  return Object.values(p).filter(Boolean).length;
}

function humanizeButtonStyle(v) {
  if (v === "icon_only") return "Icon only";
  if (v === "icon_text") return "Icon + text";
  if (v === "floating_bar") return "Floating bar";
  return "—";
}

function humanizePlacement(v) {
  if (v === "above_atc") return "Above ATC";
  if (v === "below_description") return "Below description";
  if (v === "floating") return "Floating";
  return "—";
}

function humanizePlatform(p) {
  const m = {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    messenger: "Messenger",
    facebook: "Facebook",
    pinterest: "Pinterest",
    twitter: "X",
    email: "Email",
    copy: "Copy link",
  };
  return m[p] || p || "—";
}

function formatInt(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString();
}

function openThemeEditorTopFrame() {
  const url = "https://admin.shopify.com/themes/current/editor";
  const a = document.createElement("a");
  a.href = url;
  a.target = "_top";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
