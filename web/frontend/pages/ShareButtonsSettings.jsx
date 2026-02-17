// FILE: web/frontend/pages/ShareButtonsSettings.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Page, Layout, Banner, Spinner } from "@shopify/polaris";
import { SaveBar } from "@shopify/app-bridge-react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Toast } from "@shopify/app-bridge/actions";

import { useShareButtonsSettings } from "../hooks/useShareButtonsSettings";
import { ShareButtonsForm } from "../components/share-buttons/ShareButtonsForm";
import { ShareButtonsPreview } from "../components/share-buttons/ShareButtonsPreview";


export default function ShareButtonsSettingsPage() {
  const app = useAppBridge();

  const {
    loading,
    saving,
    error,
    draft,
    setDraft,
    dirty,
    save,
    discard,
  } = useShareButtonsSettings();

  const [lastToast, setLastToast] = useState(null);

  const showToast = useCallback(
    (content, isError = false) => {
      // Prevent “double click to show toast” bugs by closing previous toast first
      try {
        lastToast?.dispatch(Toast.Action.CLEAR);
      } catch (_) {}

      const toast = Toast.create(app, {
        message: content,
        duration: 4000,
        isError,
      });
      toast.dispatch(Toast.Action.SHOW);
      setLastToast(toast);
    },
    [app, lastToast]
  );

  const onSave = useCallback(async () => {
    const result = await save();
    if (result.ok) showToast("Settings saved");
    else showToast(result.error || "Failed to save", true);
  }, [save, showToast]);

  const onDiscard = useCallback(() => {
    discard();
    showToast("Discarded changes");
  }, [discard, showToast]);

  // App Bridge SaveBar should appear only when dirty.
  // Use hidden prop rather than conditional render to avoid flicker on first paint.
  const saveBarVisible = useMemo(() => dirty, [dirty]);

  // If your app also has subscription gating:
  // - You can insert a banner and block save by returning early in onSave.
  // Keeping it minimal here per your requirement.

  if (loading) {
    return (
      <Page title="Share Buttons">
        <Layout>
          <Layout.Section>
            <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
              <Spinner accessibilityLabel="Loading settings" size="large" />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Share Buttons">
      <SaveBar
        id="share-buttons-savebar"
        open={saveBarVisible}
        onSave={onSave}
        onDiscard={onDiscard}
        loading={saving}
        // Critical: disable save when not dirty OR while saving
        disabled={!dirty || saving}
      />

      <Layout>
        <Layout.Section>
          {error ? (
            <Banner tone="critical" title="Couldn’t load/save settings">
              <p>{error}</p>
            </Banner>
          ) : null}
        </Layout.Section>

        <Layout.Section>
          <ShareButtonsForm draft={draft} setDraft={setDraft} />
        </Layout.Section>

        <Layout.Section secondary>
          <ShareButtonsPreview settings={draft} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
