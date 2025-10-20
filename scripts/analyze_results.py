import sys
import os
import pandas as pd
import numpy as np
from scipy import stats
import seaborn as sns
import matplotlib.pyplot as plt
import pingouin as pg
import statsmodels.api as sm

sns.set(style="whitegrid")
ROOT = os.path.dirname(__file__)
OUT_DIR = os.path.join(ROOT, 'figs')
os.makedirs(OUT_DIR, exist_ok=True)

if len(sys.argv) < 2:
    print("Usage: python analyze_results.py scripts/sessions.csv")
    sys.exit(1)

csv_path = sys.argv[1]
df = pd.read_csv(csv_path)

# Basic cleaning
df = df.dropna(subset=['group', 'pre_score', 'post_score'])

# Descriptive table
desc = df.groupby('group').agg(
    N=('session_id','count'),
    pre_mean=('pre_score','mean'),
    post_mean=('post_score','mean'),
    gain_mean=('post_score', lambda x: x.mean() - df.loc[x.index,'pre_score'].mean()),
    rouge_mean=('rouge_l','mean'),
    ai_latency_median=('ai_latency_ms','median'),
    satisfaction_mean=('satisfaction','mean')
).round(3)
print("\nDESCRIPTIVE\n", desc)

# Paired test for Tandemly (if present)
if 'Tandemly' in df['group'].unique():
    tand = df[df.group=='Tandemly']
    if len(tand) >= 5:
        t, p = stats.ttest_rel(tand.post_score, tand.pre_score, nan_policy='omit')
        d = (tand.post_score - tand.pre_score).mean() / (tand.post_score - tand.pre_score).std(ddof=1)
        print(f"\nTandemly paired t-test: t={t:.3f}, p={p:.4g}, Cohen_d={d:.3f}")

# ANOVA on ROUGE-L
groups = [g['rouge_l'].dropna().values for _,g in df.groupby('group')]
if len(groups) > 1:
    try:
        f, p = stats.f_oneway(*groups)
        eta2 = pg.compute_effsize(df, dv='rouge_l', between='group', effsize='eta2')
        print(f"\nANOVA ROUGE-L: F={f:.3f}, p={p:.4g}, eta2={eta2:.3f}")
        mc = sm.stats.multicomp.MultiComparison(df['rouge_l'].dropna(), df['group'].loc[df['rouge_l'].notna()])
        tuk = mc.tukeyhsd()
        print("\nTukey HSD (ROUGE-L):\n", tuk.summary())
    except Exception as e:
        print("ANOVA failed:", e)

# Create plots
df['gain'] = df['post_score'] - df['pre_score']

plt.figure(figsize=(8,5))
sns.barplot(x='group', y='gain', data=df, ci=95, capsize=0.12)
plt.title('Mean Learning Gain (post - pre)')
plt.ylabel('Score gain')
plt.tight_layout()
gain_file = os.path.join(OUT_DIR,'gain_by_group.png')
plt.savefig(gain_file)
print("Saved", gain_file)

plt.figure(figsize=(8,5))
sns.boxplot(x='group', y='ai_latency_ms', data=df)
plt.title('AI Response Latency by Group (ms)')
plt.tight_layout()
lat_file = os.path.join(OUT_DIR,'latency_boxplot.png')
plt.savefig(lat_file)
print("Saved", lat_file)

plt.figure(figsize=(8,5))
sns.barplot(x='group', y='rouge_l', data=df, ci=95, capsize=0.12)
plt.title('ROUGE-L by Group')
plt.tight_layout()
rouge_file = os.path.join(OUT_DIR,'rouge_by_group.png')
plt.savefig(rouge_file)
print("Saved", rouge_file)

# Save cleaned CSV used for analysis
export_csv = os.path.join(ROOT, 'sessions_exported_for_paper.csv')
df.to_csv(export_csv, index=False)
print("Saved", export_csv)