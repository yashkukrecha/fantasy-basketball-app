# THIS THE PYTHON SCRIPT OF THE ml/kmeans_fantasy_basketball.ipynb FILE
# THIS WAS MADE TO IMPORT THE LISTS
# %%
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# %%
df = pd.read_csv('ml/all_seasons.csv')

# %%
df = df.drop(columns=['Unnamed: 0', 'college', 'country', 'draft_year', 'draft_round', 'draft_number'])
df['season'] = (df['season'].str[:2] + df['season'].str[-2:]).fillna(0).astype(int)

# %%
df = df[df['season'] == 2023]
df.drop(columns=['season'], inplace=True)

# %%
scaler = StandardScaler()
df[['age', 'player_height', 'player_weight', 'gp', 'pts', 'reb', 'ast', 'net_rating']] = scaler.fit_transform(df[['age', 'player_height', 'player_weight', 'gp', 'pts', 'reb', 'ast', 'net_rating']])
# %%
player_team_df = df[['player_name', 'team_abbreviation']]
df = df.drop(columns=['player_name', 'team_abbreviation'])

# %%
# def optimize_k_means(data, max_k):
#   means = []
#   inertias = []
#   for k in range(1, max_k):
#     kmeans = KMeans(n_clusters=k)
#     kmeans.fit(data)
#     means.append(k)
#     inertias.append(kmeans.inertia_)

#   fig = plt.subplots(figsize=(10, 5))
#   plt.plot(means, inertias, 'o-')
#   plt.xlabel('Number of Clusters')
#   plt.ylabel('Inertia')
#   plt.title('Elbow Method')
#   plt.grid(True)
#   plt.show()

# %%
# optimize_k_means(df, 10)

# %%
kmeans = KMeans(n_clusters=5)
kmeans.fit(df)
df['kmeans'] = kmeans.labels_
df = pd.concat([player_team_df, df], axis=1)

# %%
import mpl_toolkits.mplot3d.axes3d as p3

# %%
# fig = plt.figure()
# ax = p3.Axes3D(fig)
# x_vals = df['pts']
# y_vals = df['reb']
# z_vals = df['ast']
# ax.scatter(x_vals, y_vals, z_vals, c=df['kmeans'])
# ax.set_xlabel('Points')
# ax.set_ylabel('Rebounds')
# ax.set_zlabel('Assists')
# ax.set_title('K-Means Clustering')
# fig.add_axes(ax)
# plt.show()

# %%
group1 = df[df['kmeans'] == 0]['player_name'].tolist()
group2 = df[df['kmeans'] == 1]['player_name'].tolist()
group3 = df[df['kmeans'] == 2]['player_name'].tolist()
group4 = df[df['kmeans'] == 3]['player_name'].tolist()
group5 = df[df['kmeans'] == 4]['player_name'].tolist()


