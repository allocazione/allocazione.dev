let cache = {
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const load = async ({ fetch, setHeaders }) => {
    try {
        const now = Date.now();
        if (cache.data && (now - cache.timestamp) < CACHE_DURATION) {
            setHeaders({
                'Cache-Control': 'public, max-age=60'
            });
            return cache.data;
        }

        setHeaders({
            'Cache-Control': 'public, max-age=60'
        });

        const res = await fetch(`https://api.github.com/users/allocazione/repos?sort=updated&per_page=30`);
        
        if (!res.ok) {
            console.error('GitHub API error:', res.statusText);
            return cache.data || { projects: [], stats: null };
        }
        
        const repos = await res.json();
        
        if (!Array.isArray(repos)) {
            return { projects: [], stats: null };
        }

        const nonForks = repos.filter(repo => !repo.fork).slice(0, 12);

        let totalStars = 0;
        const languageCounts = {};

        const projects = nonForks.map(repo => {
            totalStars += repo.stargazers_count;
            
            let tags = [];
            const isPersonal = repo.name.toLowerCase() === repo.owner.login.toLowerCase();

            if (repo.language) {
                const lang = repo.language;
                languageCounts[lang] = (languageCounts[lang] || 0) + 1;
                tags.push(lang.toLowerCase());
            } else if (isPersonal) {
                languageCounts['Markdown'] = (languageCounts['Markdown'] || 0) + 1;
            }
            
            if (isPersonal && !tags.includes('markdown')) {
                tags.push('markdown');
            }
            
            return {
                title: repo.name.toLowerCase(),
                description: repo.description ? repo.description.toLowerCase() : 'no description provided.',
                link: repo.html_url,
                pushedAt: repo.pushed_at,
                tags
            };
        });

        if (languageCounts['Batchfile']) {
            languageCounts['Shell'] = (languageCounts['Shell'] || 0) + languageCounts['Batchfile'];
        }

        const omittedLanguages = ['Makefile', 'Dockerfile', 'AutoHotkey', 'Batchfile'];
        omittedLanguages.forEach(lang => {
            delete languageCounts[lang];
        });

        const totalLanguages = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;

        const langColors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#3178c6',
            'Python': '#3572A5',
            'Svelte': '#ff3e00',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Rust': '#dea584',
            'Go': '#00add8',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'C#': '#178600',
            'PHP': '#4f5d95',
            'Ruby': '#701516',
            'Shell': '#89e051',
            'Vue': '#41b883',
            'Lua': '#000080',
            'Sass': '#a53b70',
            'Markdown': '#083fa1'
        };

        const topLanguages = Object.entries(languageCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([lang, count]) => {
                const exactPct = (count / totalLanguages) * 100;
                return {
                    name: lang.toLowerCase(),
                    percent: exactPct,
                    displayPercent: Math.round(exactPct),
                    count: count,
                    color: langColors[lang] || '#8b8b8b'
                };
            });

        const stats = {
            totalRepos: nonForks.length,
            totalStars,
            topLanguages
        };

        const result = { projects, stats };
        
        cache.data = result;
        cache.timestamp = Date.now();

        return result;
    } catch (e) {
        console.error('Error fetching projects:', e);
        return cache.data || { projects: [], stats: null };
    }
};
