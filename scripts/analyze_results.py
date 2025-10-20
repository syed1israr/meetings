import sys, os
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy import stats
import pingouin as pg

sns.set(style="whitegrid")
ROOT = os.path.dirname(__file__)
OUT_DIR = os.path.join(ROOT, 'figs')
os.makedirs(OUT_DIR, exist_ok=True)

if len(sys.argv) < 2:
    csv_path = os.path.join(ROOT, 'sessions.csv')
else:
    csv_path = sys.argv[1]

df = pd.read_csv(csv_path)

label_map = {'Google':'Google Classroom','Moodle':'Moodle LMS','Teams':'Microsoft Teams (Education)','Tandemly':'Tandemly'}
df['group'] = df['group'].map(label_map).fillna(df['group'])
df = df.dropna(subset=['group','pre_score','post_score'])
df['gain'] = df['post_score'] - df['pre_score']

# Descriptives
desc = df.groupby('group').agg(
    N=('session_id','count'),
    pre_mean=('pre_score','mean'),
    pre_sd=('pre_score','std'),
    post_mean=('post_score','mean'),
    post_sd=('post_score','std'),
    gain_mean=('gain','mean'),
    gain_sd=('gain','std'),
    rouge_mean=('rouge_l','mean'),
    rouge_sd=('rouge_l','std'),
    ai_latency_med=('ai_latency_ms','median')
).round(3)

# add IQR separately
iqr = df.groupby('group')['ai_latency_ms'].agg(lambda x: int(x.quantile(0.75)-x.quantile(0.25)))
desc['ai_latency_iqr'] = iqr

print("\nDESCRIPTIVE\n", desc)

results_file = os.path.join(ROOT, 'results_summary.txt')
with open(results_file, 'w', encoding='utf-8') as rf:
    rf.write("DESCRIPTIVE\n")
    rf.write(desc.to_string())
    rf.write("\n\n")

# Paired Tandemly pre->post
if 'Tandemly' in df['group'].unique():
    tand = df[df.group=='Tandemly']
    if len(tand) >= 5:
        t, p = stats.ttest_rel(tand.post_score, tand.pre_score, nan_policy='omit')
        d = (tand.post_score - tand.pre_score).mean() / (tand.post_score - tand.pre_score).std(ddof=1)
        line = f"Tandemly paired t-test: t={t:.3f}, p={p:.4g}, Cohen_d={d:.3f}\n"
        print(line)
        with open(results_file, 'a', encoding='utf-8') as rf:
            rf.write(line)

# ANOVA and pairwise for gain and ROUGE
try:
    ag = pg.anova(dv='gain', between='group', data=df, detailed=True)
    pg_pair_gain = pg.pairwise_tests(dv='gain', between='group', data=df, padjust='bonf')
    print("\nANOVA gain\n", ag)
    with open(results_file, 'a', encoding='utf-8') as rf:
        rf.write("\nANOVA gain\n")
        rf.write(ag.to_string())
        rf.write("\n\nPairwise gain\n")
        rf.write(pg_pair_gain.to_string())
except Exception as e:
    print("ANOVA gain failed:", e)

try:
    ar = pg.anova(dv='rouge_l', between='group', data=df, detailed=True)
    pg_pair_rouge = pg.pairwise_tests(dv='rouge_l', between='group', data=df, padjust='bonf')
    print("\nANOVA rouge\n", ar)
    with open(results_file, 'a', encoding='utf-8') as rf:
        rf.write("\nANOVA rouge\n")
        rf.write(ar.to_string())
        rf.write("\n\nPairwise rouge\n")
        rf.write(pg_pair_rouge.to_string())
except Exception as e:
    print("ANOVA rouge failed:", e)

# Nonparametric latency tests
try:
    groups_latency = [g['ai_latency_ms'].dropna().values for _,g in df.groupby('group')]
    kw_stat, kw_p = stats.kruskal(*groups_latency)
    pl = pg.pairwise_tests(dv='ai_latency_ms', between='group', data=df, parametric=False, padjust='bonf')
    print(f"\nKruskal-Wallis latency: H={kw_stat:.3f}, p={kw_p:.4g}")
    with open(results_file, 'a', encoding='utf-8') as rf:
        rf.write(f"\nKruskal-Wallis latency: H={kw_stat:.3f}, p={kw_p:.4g}\n")
        rf.write("\nPairwise latency\n")
        rf.write(pl.to_string())
except Exception as e:
    print("Latency tests failed:", e)

# Save cleaned CSV
export_csv = os.path.join(ROOT, 'sessions_exported_for_paper.csv')
df.to_csv(export_csv, index=False)
print("Saved", export_csv)

# Plots
plt.figure(figsize=(8,5))
sns.barplot(x='group', y='gain', data=df, ci=95, capsize=0.12)
plt.title('Mean Learning Gain (post - pre)')
plt.ylabel('Score gain')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR,'gain_by_group.png'), dpi=300)
print("Saved gain_by_group.png")

plt.figure(figsize=(8,5))
sns.boxplot(x='group', y='ai_latency_ms', data=df)
plt.title('AI Response Latency by Group (ms)')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR,'latency_boxplot.png'), dpi=300)
print("Saved latency_boxplot.png")

plt.figure(figsize=(8,5))
sns.barplot(x='group', y='rouge_l', data=df, ci=95, capsize=0.12)
plt.title('ROUGE-L by Group')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR,'rouge_by_group.png'), dpi=300)
print("Saved rouge_by_group.png")