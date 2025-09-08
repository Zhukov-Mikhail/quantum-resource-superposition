// Визуализация распределения ресурсов

function renderResourceAllocation(project, allocation) {
    const container = document.getElementById('resourceAllocation');
    container.innerHTML = '';
    
    const width = container.clientWidth;
    const height = 400;
    const margin = {top: 20, right: 30, bottom: 50, left: 60};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Создаем SVG
    const svg = d3.select("#resourceAllocation")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Шкалы
    const x = d3.scaleBand()
        .domain(project.tasks.map(d => d.name))
        .range([0, chartWidth])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(allocation, d => d.devEffort + d.designEffort + d.analystEffort) * 1.1])
        .range([chartHeight, 0]);
    
    // Ось X
    svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    // Ось Y
    svg.append("g")
        .call(d3.axisLeft(y).ticks(10));
    
    // Название осей
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Усилия (часы)");
    
    // Группируем данные для стекированного бара
    const stackData = project.tasks.map((task, i) => ({
        task: task.name,
        developers: allocation[i].devEffort,
        designers: allocation[i].designEffort,
        analysts: allocation[i].analystEffort
    }));
    
    const series = d3.stack()
        .keys(["developers", "designers", "analysts"])
        (stackData);
    
    // Цвета для ресурсов
    const color = d3.scaleOrdinal()
        .domain(["developers", "designers", "analysts"])
        .range(["#4a154b", "#6a0dad", "#9b5de5"]);
    
    // Стекированные бары
    const groups = svg.selectAll(".series")
        .data(series)
        .enter().append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", (d, i) => x(stackData[i].task))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    
    // Легенда
    const legend = svg.append("g")
        .attr("transform", `translate(${chartWidth - 180}, 10)`);
    
    const resources = ["developers", "designers", "analysts"];
    resources.forEach((resource, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(resource));
        
        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .text(resource.charAt(0).toUpperCase() + resource.slice(1))
            .attr("font-size", "12px");
    });
    
    // Добавляем подсказки
    groups.on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        const [xPos, yPos] = d3.pointer(event);
        
        svg.append("text")
            .attr("class", "tooltip")
            .attr("x", xPos + 10)
            .attr("y", yPos)
            .text(`${d.data.task}: ${Math.round(d[1] - d[0])} часов`)
            .attr("font-size", "12px")
            .attr("fill", "#333");
    })
    .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        svg.select(".tooltip").remove();
    });
}

function renderResourceTimeline(timeline) {
    const container = document.getElementById('resourceTimeline');
    container.innerHTML = '';
    
    const width = container.clientWidth;
    const height = 400;
    const margin = {top: 20, right: 30, bottom: 50, left: 100};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Создаем SVG
    const svg = d3.select("#resourceTimeline")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Определяем временные рамки
    const startDate = d3.min(timeline, d => d.start);
    const endDate = d3.max(timeline, d => d.end);
    const timeScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, chartWidth]);
    
    // Ось X (время)
    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(timeScale).ticks(d3.timeWeek));
    
    // Названия задач
    const yAxis = svg.append("g")
        .call(d3.axisLeft(d3.scaleBand()
            .domain(timeline.map(d => d.name))
            .range([0, chartHeight]))
            .tickSize(0));
    
    // Гантт-диаграмма
    const bars = svg.selectAll(".bar")
        .data(timeline)
        .enter()
        .append("g")
        .attr("class", "bar");
    
    // Фон задачи
    bars.append("rect")
        .attr("class", "task-background")
        .attr("x", d => timeScale(d.start))
        .attr("y", (d, i) => i * (chartHeight / timeline.length))
        .attr("width", d => timeScale(d.end) - timeScale(d.start))
        .attr("height", chartHeight / timeline.length - 2)
        .attr("fill", "#f0f0f0")
        .attr("rx", 3);
    
    // Прогресс задачи
    bars.append("rect")
        .attr("class", "task-progress")
        .attr("x", d => timeScale(d.start))
        .attr("y", (d, i) => i * (chartHeight / timeline.length))
        .attr("width", d => (timeScale(d.end) - timeScale(d.start)) * (d.progress / 100))
        .attr("height", chartHeight / timeline.length - 2)
        .attr("fill", d => d.requiresDesign ? "#6a0dad" : d.requiresAnalysis ? "#9b5de5" : "#4a154b")
        .attr("rx", 3);
    
    // Название задачи
    bars.append("text")
        .attr("x", d => timeScale(d.start) + 5)
        .attr("y", (d, i) => i * (chartHeight / timeline.length) + (chartHeight / timeline.length) / 2 + 4)
        .text(d => d.name)
        .attr("font-size", "12px")
        .attr("fill", "#333");
    
    // Процент выполнения
    bars.append("text")
        .attr("x", d => timeScale(d.end) - 25)
        .attr("y", (d, i) => i * (chartHeight / timeline.length) + (chartHeight / timeline.length) / 2 + 4)
        .text(d => `${d.progress}%`)
        .attr("font-size", "12px")
        .attr("fill", "white")
        .attr("font-weight", "bold");
    
    // Легенда
    const legend = svg.append("g")
        .attr("transform", `translate(${chartWidth - 200}, 10)`);
    
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#4a154b");
    
    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text("Разработка")
        .attr("font-size", "12px");
    
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#6a0dad");
    
    legend.append("text")
        .attr("x", 20)
        .attr("y", 32)
        .text("Дизайн")
        .attr("font-size", "12px");
    
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#9b5de5");
    
    legend.append("text")
        .attr("x", 20)
        .attr("y", 52)
        .text("Анализ")
        .attr("font-size", "12px");
}

function renderQuantumSuperposition(results) {
    const container = document.getElementById('quantumSuperposition');
    container.innerHTML = '';
    
    const width = container.clientWidth;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // Создаем SVG
    const svg = d3.select("#quantumSuperposition")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${centerX},${centerY})`);
    
    // Квантовые уровни
    const levels = 5;
    for (let i = 0; i < levels; i++) {
        const levelRadius = radius * (i + 1) / levels;
        svg.append("circle")
            .attr("r", levelRadius)
            .attr("fill", "none")
            .attr("stroke", i === 2 ? "#4a154b" : "#aaa")
            .attr("stroke-width", i === 2 ? 2 : 0.5)
            .attr("opacity", 0.3);
    }
    
    // Генерируем квантовые состояния (точки)
    const statesCount = 100;
    const states = [];
    
    for (let i = 0; i < statesCount; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius * 0.9;
        
        // Вероятность состояния зависит от близости к оптимальной зоне
        const optimalAngle = Math.PI / 4; // Угол оптимальной зоны
        const optimalDistance = radius * 0.7; // Расстояние до оптимальной зоны
        
        const angleDiff = Math.min(
            Math.abs(angle - optimalAngle),
            Math.abs(angle - optimalAngle + 2 * Math.PI),
            Math.abs(angle - optimalAngle - 2 * Math.PI)
        );
        
        const distanceDiff = Math.abs(distance - optimalDistance);
        
        // Нормализуем разницу
        const normalizedAngleDiff = angleDiff / Math.PI;
        const normalizedDistanceDiff = distanceDiff / radius;
        
        // Вычисляем вероятность (чем ближе к оптимальной зоне, тем выше вероятность)
        const probability = Math.max(0, 1 - (normalizedAngleDiff * 0.6 + normalizedDistanceDiff * 0.4));
        
        states.push({
            angle: angle,
            distance: distance,
            probability: probability
        });
    }
    
    // Сортируем состояния по вероятности
    states.sort((a, b) => b.probability - a.probability);
    
    // Рисуем состояния
    const stateCircles = svg.selectAll(".state")
        .data(states)
        .enter()
        .append("circle")
        .attr("cx", d => Math.cos(d.angle) * d.distance)
        .attr("cy", d => Math.sin(d.angle) * d.distance)
        .attr("r", d => 2 + d.probability * 5)
        .attr("fill", d => d3.interpolateRgb('#aaa', '#4a154b')(d.probability))
        .attr("opacity", d => 0.2 + d.probability * 0.8);
    
    // Оптимальная зона
    svg.append("circle")
        .attr("r", radius * 0.15)
        .attr("fill", "none")
        .attr("stroke", "#4a154b")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0.7)
        .attr("transform", `rotate(${(Math.PI / 4) * (180 / Math.PI)}) translate(${radius * 0.7}, 0)`);
    
    // Анимация квантового эффекта
    stateCircles
        .transition()
        .duration(2000)
        .attr("r", d => 1 + d.probability * 3)
        .ease(d3.easeElastic.out)
        .on("end", function repeat() {
            d3.active(this)
                .transition()
                .duration(3000 + Math.random() * 2000)
                .attr("r", d => 2 + d.probability * 5)
                .transition()
                .duration(2000)
                .attr("r", d => 1 + d.probability * 3)
                .on("end", repeat);
        });
    
    // Легенда
    const legend = svg.append("g")
        .attr("transform", `translate(${-width/2 + 20}, ${-height/2 + 20})`);
    
    legend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text("Квантовая суперпозиция ресурсов")
        .attr("font-weight", "bold")
        .attr("font-size", "14px");
    
    legend.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .text("Размер и яркость точек показывают вероятность состояния")
        .attr("font-size", "12px")
        .attr("fill", "#666");
}
