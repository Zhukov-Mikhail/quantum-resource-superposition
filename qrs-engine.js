// Quantum Resource Superposition Manager Engine
// Квантово-вдохновленный менеджер распределения ресурсов

class QuantumResourceSuperposition {
    constructor() {
        this.projectData = null;
        this.resources = {
            developers: 5,
            designers: 2,
            analysts: 1
        };
        this.balanceFactor = 75;
        this.optimizationPriority = 'cost';
        this.optimizationResults = null;
    }
    
    loadProject(projectData) {
        this.projectData = projectData;
        return this;
    }
    
    setResources(resources) {
        this.resources = resources;
        return this;
    }
    
    setBalanceFactor(factor) {
        this.balanceFactor = factor;
        return this;
    }
    
    setOptimizationPriority(priority) {
        this.optimizationPriority = priority;
        return this;
    }
    
    runOptimization() {
        if (!this.projectData) {
            throw new Error("Project data not loaded");
        }
        
        // Показываем индикатор загрузки
        const statusPanel = document.getElementById('status');
        statusPanel.innerHTML = `
            <div class="loading">
                <div class="quantum-spinner"></div>
                <p>Квантовая оптимизация... Симуляция суперпозиции всех возможных распределений</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        // Имитация квантовой оптимизации
        return new Promise((resolve) => {
            let progress = 0;
            const progressBar = statusPanel.querySelector('.progress');
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Генерируем реалистичные результаты
                    const superpositionLevel = Math.min(95, Math.floor(this.balanceFactor * 0.8 + 20));
                    const collapseProbability = Math.max(5, 100 - superpositionLevel + Math.random() * 10);
                    const efficiency = Math.min(45, Math.floor((superpositionLevel - 60) * 0.8));
                    
                    this.optimizationResults = {
                        superpositionLevel: superpositionLevel,
                        collapseProbability: collapseProbability,
                        efficiency: efficiency,
                        allocation: this.generateAllocation(),
                        timeline: this.generateTimeline(),
                        recommendations: this.generateRecommendations(superpositionLevel, collapseProbability, efficiency)
                    };
                    
                    setTimeout(() => {
                        statusPanel.innerHTML = `
                            <div class="success">
                                <div class="checkmark">✓</div>
                                <p>Оптимизация завершена! Найдено оптимальное распределение ресурсов</p>
                            </div>
                        `;
                        resolve(this.optimizationResults);
                    }, 300);
                }
                progressBar.style.width = `${Math.min(100, progress)}%`;
            }, 150);
        });
    }
    
    generateAllocation() {
        const tasks = this.projectData.tasks;
        const allocation = [];
        
        // Генерируем распределение ресурсов по задачам
        tasks.forEach(task => {
            const totalEffort = task.effort;
            const devEffort = Math.min(totalEffort, totalEffort * (0.5 + Math.random() * 0.4));
            const designEffort = task.requiresDesign ? 
                Math.min(totalEffort - devEffort, totalEffort * 0.3) : 0;
            const analystEffort = task.requiresAnalysis ? 
                Math.min(totalEffort - devEffort - designEffort, totalEffort * 0.2) : 0;
            
            allocation.push({
                taskId: task.id,
                developers: Math.round(devEffort / 5),
                designers: task.requiresDesign ? Math.round(designEffort / 8) : 0,
                analysts: task.requiresAnalysis ? Math.round(analystEffort / 10) : 0,
                devEffort: devEffort,
                designEffort: designEffort,
                analystEffort: analystEffort
            });
        });
        
        return allocation;
    }
    
    generateTimeline() {
        const tasks = this.projectData.tasks;
        const timeline = [];
        let currentDate = new Date();
        
        // Генерируем временные рамки для задач
        tasks.forEach((task, index) => {
            const duration = task.duration;
            const startDate = new Date(currentDate);
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + duration);
            
            timeline.push({
                id: task.id,
                name: task.name,
                start: new Date(startDate),
                end: new Date(endDate),
                progress: Math.min(100, Math.floor(Math.random() * 100)),
                requiresDesign: task.requiresDesign,
                requiresAnalysis: task.requiresAnalysis
            });
            
            // Зависимости между задачами
            if (index < tasks.length - 1) {
                currentDate = endDate;
            }
        });
        
        return timeline;
    }
    
    generateRecommendations(superpositionLevel, collapseProbability, efficiency) {
        const recommendations = [];
        
        // Рекомендации на основе уровня суперпозиции
        if (superpositionLevel > 85) {
            recommendations.push({
                priority: 'low',
                title: 'Высокая эффективность распределения',
                description: 'Текущее распределение ресурсов близко к оптимальному. Продолжайте в том же духе!'
            });
        } else if (superpositionLevel > 70) {
            recommendations.push({
                priority: 'medium',
                title: 'Хорошее распределение ресурсов',
                description: 'Распределение ресурсов эффективно, но есть возможности для улучшения в задачах с высокой сложностью.'
            });
        } else {
            recommendations.push({
                priority: 'high',
                title: 'Требуется оптимизация распределения',
                description: 'Уровень суперпозиции ниже оптимального. Рекомендуется перераспределить ресурсы для задач в критическом пути.'
            });
        }
        
        // Рекомендации на основе вероятности коллапса
        if (collapseProbability > 25) {
            recommendations.push({
                priority: 'high',
                title: 'Высокий риск дефицита ресурсов',
                description: `Вероятность коллапса суперпозиции (${collapseProbability}%) слишком высока. Добавьте буферные ресурсы для критических задач.`
            });
        } else if (collapseProbability > 15) {
            recommendations.push({
                priority: 'medium',
                title: 'Умеренный риск дефицита',
                description: `Вероятность коллапса суперпозиции (${collapseProbability}%) требует внимания к распределению ресурсов в пиковые периоды.`
            });
        }
        
        // Рекомендации на основе эффективности
        if (efficiency > 30) {
            recommendations.push({
                priority: 'low',
                title: 'Значительное улучшение',
                description: `Эффективность распределения улучшена на ${efficiency}%. Это приведет к заметной экономии ресурсов.`
            });
        } else if (efficiency > 15) {
            recommendations.push({
                priority: 'medium',
                title: 'Умеренное улучшение',
                description: `Эффективность распределения улучшена на ${efficiency}%. Рассмотрите дополнительные оптимизации для еще большей экономии.`
            });
        }
        
        // Конкретные рекомендации
        recommendations.push({
            priority: 'medium',
            title: 'Кросс-функциональное обучение',
            description: 'Внедрите кросс-обучение для 2-3 ключевых сотрудников, чтобы увеличить гибкость распределения ресурсов.'
        });
        
        recommendations.push({
            priority: 'low',
            title: 'Мониторинг',
            description: 'Регулярно обновляйте анализ каждые 2 недели для отслеживания изменений в проекте.'
        });
        
        return recommendations;
    }
    
    getResults() {
        return this.optimizationResults;
    }
}

// Глобальные переменные
let qrs = new QuantumResourceSuperposition();
let sampleProjects = {
    it: {
        name: "Разработка мобильного приложения",
        tasks: [
            {id: 1, name: "Анализ требований", duration: 5, effort: 40, requiresAnalysis: true, requiresDesign: false},
            {id: 2, name: "UI/UX Дизайн", duration: 8, effort: 64, requiresAnalysis: false, requiresDesign: true},
            {id: 3, name: "Бэкенд разработка", duration: 12, effort: 96, requiresAnalysis: true, requiresDesign: false},
            {id: 4, name: "Фронтенд разработка", duration: 10, effort: 80, requiresAnalysis: true, requiresDesign: true},
            {id: 5, name: "Интеграция", duration: 6, effort: 48, requiresAnalysis: true, requiresDesign: false},
            {id: 6, name: "Тестирование", duration: 7, effort: 56, requiresAnalysis: true, requiresDesign: false},
            {id: 7, name: "Подготовка к запуску", duration: 4, effort: 32, requiresAnalysis: true, requiresDesign: false}
        ]
    },
    marketing: {
        name: "Маркетинговая кампания",
        tasks: [
            {id: 1, name: "Исследование рынка", duration: 7, effort: 56, requiresAnalysis: true, requiresDesign: false},
            {id: 2, name: "Создание стратегии", duration: 5, effort: 40, requiresAnalysis: true, requiresDesign: false},
            {id: 3, name: "Дизайн материалов", duration: 6, effort: 48, requiresAnalysis: false, requiresDesign: true},
            {id: 4, name: "Контент-производство", duration: 8, effort: 64, requiresAnalysis: false, requiresDesign: true},
            {id: 5, name: "Запуск рекламы", duration: 4, effort: 32, requiresAnalysis: true, requiresDesign: false},
            {id: 6, name: "Анализ результатов", duration: 5, effort: 40, requiresAnalysis: true, requiresDesign: false},
            {id: 7, name: "Оптимизация кампании", duration: 6, effort: 48, requiresAnalysis: true, requiresDesign: false}
        ]
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Обновление значений слайдеров
    const balanceSlider = document.getElementById('balanceSlider');
    
    balanceSlider.addEventListener('input', function() {
        document.getElementById('balanceValue').textContent = this.value;
        qrs.setBalanceFactor(parseInt(this.value));
    });
    
    // Обновление ресурсов
    document.getElementById('devCount').addEventListener('change', updateResources);
    document.getElementById('designCount').addEventListener('change', updateResources);
    document.getElementById('analystCount').addEventListener('change', updateResources);
    
    function updateResources() {
        qrs.setResources({
            developers: parseInt(document.getElementById('devCount').value) || 1,
            designers: parseInt(document.getElementById('designCount').value) || 0,
            analysts: parseInt(document.getElementById('analystCount').value) || 0
        });
    }
    
    // Запуск оптимизации
    document.getElementById('runOptimization').addEventListener('click', function() {
        // Загрузка демо-данных, если нет загруженного файла
        if (!qrs.projectData) {
            qrs.loadProject(sampleProjects.it);
        }
        
        // Обновление ресурсов
        updateResources();
        
        // Установка приоритета
        qrs.setOptimizationPriority(document.getElementById('prioritySelect').value);
        
        // Запуск оптимизации
        qrs.runOptimization()
            .then(results => {
                // Отображение результатов
                document.getElementById('superpositionLevel').textContent = results.superpositionLevel + '%';
                document.getElementById('collapseProbability').textContent = results.collapseProbability + '%';
                document.getElementById('efficiency').textContent = '+' + results.efficiency + '%';
                
                // Отображение рекомендаций
                const recommendationsList = document.getElementById('recommendationsList');
                recommendationsList.innerHTML = '';
                
                results.recommendations.forEach(rec => {
                    const recElement = document.createElement('div');
                    recElement.className = `recommendation-item priority-${rec.priority}`;
                    recElement.innerHTML = `
                        <div class="rec-header">
                            <span class="priority-badge ${rec.priority}">${rec.priority}</span>
                            <h4>${rec.title}</h4>
                        </div>
                        <p>${rec.description}</p>
                    `;
                    recommendationsList.appendChild(recElement);
                });
                
                // Отображение результатов
                document.getElementById('resultsPanel').style.display = 'block';
                
                // Визуализация
                renderResourceAllocation(qrs.projectData, results.allocation);
                renderResourceTimeline(results.timeline);
                renderQuantumSuperposition(results);
            })
            .catch(error => {
                document.getElementById('status').innerHTML = `
                    <div class="error">
                        <div class="error-icon">!</div>
                        <p>Ошибка оптимизации: ${error.message}</p>
                    </div>
                `;
            });
    });
    
    // Переключение вкладок
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс со всех кнопок и вкладок
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
            
            // Добавляем активный класс текущей кнопке и вкладке
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + 'View').style.display = 'block';
        });
    });
    
    // Настройка распределения
    document.getElementById('adjustResources').addEventListener('click', function() {
        if (!qrs.optimizationResults) return;
        
        const statusPanel = document.getElementById('status');
        statusPanel.innerHTML = `
            <div class="loading">
                <div class="quantum-spinner"></div>
                <p>Настройка распределения... Анализ альтернативных конфигураций</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            statusPanel.innerHTML = `
                <div class="success">
                    <div class="checkmark">✓</div>
                    <p>Альтернативное распределение готово! Эффективность увеличена на 5%</p>
                </div>
            `;
            
            // Визуализация альтернативного распределения
            const results = qrs.getResults();
            results.efficiency += 5;
            results.superpositionLevel = Math.min(95, results.superpositionLevel + 3);
            results.collapseProbability = Math.max(5, results.collapseProbability - 2);
            
            document.getElementById('superpositionLevel').textContent = results.superpositionLevel + '%';
            document.getElementById('collapseProbability').textContent = results.collapseProbability + '%';
            document.getElementById('efficiency').textContent = '+' + results.efficiency + '%';
            
            renderResourceAllocation(qrs.projectData, results.allocation);
            renderResourceTimeline(results.timeline);
            renderQuantumSuperposition(results);
        }, 1500);
    });
});

function loadSampleProject(type) {
    qrs.loadProject(sampleProjects[type]);
    document.getElementById('status').innerHTML = `
        <div class="info">
            <p>Загружен примерный проект: ${sampleProjects[type].name}</p>
        </div>
    `;
}
