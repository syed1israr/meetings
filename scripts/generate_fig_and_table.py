import sys
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

sns.set(style="whitegrid")
ROOT = os.path.dirname(__file__)
OUT_DIR = os.path.join(ROOT, "figs")
os.makedirs(OUT_DIR, exist_ok=True)

if len(sys.argv) < 2:
    print("Usage: python generate_fig_and_table.py scripts/sessions_exported_for_paper.csv")
    sys.exit(1)

csv_path = sys.argv[1]
df = pd.read_csv(csv_path)

# Basic cleaning
df = df.dropna(subset=["group", "pre_score", "post_score"])

# Derived metrics
df["gain"] = df["post_score"] - df["pre_score"]

# Summary aggregation function
def ci95_mean(x):
    x = np.array(x.dropna())
    n = len(x)
    if n <= 1:
        return np.nan
    m = x.mean()
    se = x.std(ddof=1) / np.sqrt(n)
    h = se * stats.t.ppf(0.975, n - 1)
    return m, x.std(ddof=1), h

groups = []
for g, sub in df.groupby("group"):
    n = len(sub)
    pre_m, pre_sd, pre_h = ci95_mean(sub["pre_score"])
    post_m, post_sd, post_h = ci95_mean(sub["post_score"])
    gain_m, gain_sd, gain_h = ci95_mean(sub["gain"])
    rouge_m, rouge_sd, rouge_h = ci95_mean(sub["rouge_l"])
    sat_m, sat_sd, sat_h = ci95_mean(sub["satisfaction"])
    lat_med = sub["ai_latency_ms"].median()
    lat_iqr = sub["ai_latency_ms"].quantile(0.75) - sub["ai_latency_ms"].quantile(0.25)
    groups.append({
        "group": g,
        "N": n,
        "pre_mean": round(pre_m,3) if not pd.isna(pre_m) else "",
        "pre_sd": round(pre_sd,3) if not pd.isna(pre_sd) else "",
        "post_mean": round(post_m,3) if not pd.isna(post_m) else "",
        "post_sd": round(post_sd,3) if not pd.isna(post_sd) else "",
        "gain_mean": round(gain_m,3) if not pd.isna(gain_m) else "",
        "gain_sd": round(gain_sd,3) if not pd.isna(gain_sd) else "",
        "rouge_mean": round(rouge_m,3) if not pd.isna(rouge_m) else "",
        "rouge_sd": round(rouge_sd,3) if not pd.isna(rouge_sd) else "",
        "ai_latency_med": int(lat_med) if not pd.isna(lat_med) else "",
        "ai_latency_iqr": int(lat_iqr) if not pd.isna(lat_iqr) else "",
        "satisfaction_mean": round(sat_m,3) if not pd.isna(sat_m) else "",
        "satisfaction_sd": round(sat_sd,3) if not pd.isna(sat_sd) else "",
    })

summary_df = pd.DataFrame(groups).sort_values("group").reset_index(drop=True)

# Save summary CSV and LaTeX
summary_csv = os.path.join(ROOT, "summary_table.csv")
summary_tex = os.path.join(ROOT, "summary_table.tex")
summary_df.to_csv(summary_csv, index=False)
with open(summary_tex, "w", encoding="utf-8") as f:
    f.write(summary_df.to_latex(index=False, longtable=False, caption="Summary statistics by group", label="tab:summary", float_format="%.3f"))

print("Saved summary CSV:", summary_csv)
print("Saved summary LaTeX:", summary_tex)
print("\nSummary (console):")
print(summary_df.to_string(index=False))

# Create combined figure (3 panels)
fig, axes = plt.subplots(1, 3, figsize=(16,5))

# Panel 1: Mean gain with 95% CI (computed by seaborn)
sns.barplot(x="group", y="gain", data=df, ci=95, capsize=0.12, ax=axes[0])
axes[0].set_title("Mean Learning Gain (post - pre)")
axes[0].set_ylabel("Score gain")

# Panel 2: Latency boxplot
sns.boxplot(x="group", y="ai_latency_ms", data=df, ax=axes[1])
axes[1].set_title("AI Response Latency by Group (ms)")
axes[1].set_ylabel("Latency (ms)")

# Panel 3: ROUGE-L mean with 95% CI
sns.barplot(x="group", y="rouge_l", data=df, ci=95, capsize=0.12, ax=axes[2])
axes[2].set_title("ROUGE-L by Group")
axes[2].set_ylabel("ROUGE-L")

plt.tight_layout()
out_fig = os.path.join(OUT_DIR, "combined_metrics.png")
plt.savefig(out_fig, dpi=300)
print("Saved figure:", out_fig)