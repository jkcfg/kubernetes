import { render } from '@jkcfg/std/render';

interface RenderedTemplate {
    source?: string;
    object: object;
}

class RenderedChart {
    files: RenderedTemplate[];

    objects(): object[] {
        return this.files.map(entry => entry.object);
    }
}

interface Release {
    name: string;
    namespace?: string;
}

class Chart {
    name: string
    version?: string

    constructor(name: string) {
        this.name = name;
    }

    render(release: Release, values: object): Promise<RenderedChart> {
        return render('helm.json', {
            chart: this.name,
            release,
            values,
        }).then((data: RenderedChart) => {
            const chart = new RenderedChart()
            chart.files = data.files;
            return chart;
        })
    }
}

export {
    RenderedChart,
    Chart,
};