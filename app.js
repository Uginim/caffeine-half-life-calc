// Global variables
let caffeineData = null;
let chart = null;
let updateInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current time as default
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('intake-time').value = timeString;

    // Event listeners for preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove selected class from all buttons
            presetButtons.forEach(btn => btn.classList.remove('selected'));

            // Add selected class to clicked button
            button.classList.add('selected');

            // Set caffeine amount
            const caffeineAmount = button.getAttribute('data-caffeine');
            document.getElementById('caffeine-amount').value = caffeineAmount;

            // Optional: Show a subtle animation
            const input = document.getElementById('caffeine-amount');
            input.style.transform = 'scale(1.05)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Event listeners
    document.getElementById('calculate-btn').addEventListener('click', calculate);

    // Allow Enter key to trigger calculation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculate();
            }
        });
    });

    // When user manually types in caffeine amount, deselect all preset buttons
    document.getElementById('caffeine-amount').addEventListener('input', () => {
        presetButtons.forEach(btn => btn.classList.remove('selected'));
    });
});

function calculate() {
    // Get input values
    const caffeineAmount = parseFloat(document.getElementById('caffeine-amount').value);
    const intakeTime = document.getElementById('intake-time').value;
    const halfLife = parseFloat(document.getElementById('half-life').value);

    // Validation
    if (!caffeineAmount || caffeineAmount <= 0) {
        alert('카페인 양을 입력해주세요!');
        return;
    }

    if (!intakeTime) {
        alert('섭취 시간을 입력해주세요!');
        return;
    }

    // Store data
    caffeineData = {
        initialAmount: caffeineAmount,
        intakeTime: intakeTime,
        halfLife: halfLife
    };

    // Show results
    document.getElementById('result-section').classList.remove('hidden');

    // Start real-time updates
    updateCurrentCaffeine();
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    updateInterval = setInterval(updateCurrentCaffeine, 60000); // Update every minute

    // Generate timeline
    generateTimeline();

    // Create chart
    createChart();

    // Smooth scroll to results
    setTimeout(() => {
        document.getElementById('result-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

function calculateCaffeineAtTime(minutesElapsed) {
    // Formula: C(t) = C0 * (1/2)^(t/t_half)
    // where t is in hours
    const hoursElapsed = minutesElapsed / 60;
    const remaining = caffeineData.initialAmount * Math.pow(0.5, hoursElapsed / caffeineData.halfLife);
    return remaining;
}

function getMinutesElapsed() {
    const now = new Date();
    const [intakeHours, intakeMinutes] = caffeineData.intakeTime.split(':').map(Number);

    const intakeDate = new Date();
    intakeDate.setHours(intakeHours, intakeMinutes, 0, 0);

    // If intake time is in the future, assume it was yesterday
    if (intakeDate > now) {
        intakeDate.setDate(intakeDate.getDate() - 1);
    }

    const minutesElapsed = (now - intakeDate) / (1000 * 60);
    return minutesElapsed;
}

function updateCurrentCaffeine() {
    const minutesElapsed = getMinutesElapsed();
    const currentAmount = calculateCaffeineAtTime(minutesElapsed);
    const percentage = (currentAmount / caffeineData.initialAmount) * 100;

    // Update display
    document.getElementById('current-amount').textContent = Math.round(currentAmount);
    document.getElementById('percentage').textContent = `${Math.round(percentage)}%`;
    document.getElementById('progress-fill').style.width = `${percentage}%`;

    // Change color based on amount
    const progressFill = document.getElementById('progress-fill');
    if (percentage > 50) {
        progressFill.style.background = 'linear-gradient(90deg, #D2691E 0%, #8B4513 100%)';
    } else if (percentage > 25) {
        progressFill.style.background = 'linear-gradient(90deg, #DEB887 0%, #D2691E 100%)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #90EE90 0%, #3CB371 100%)';
    }
}

function generateTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    const now = new Date();
    const [intakeHours, intakeMinutes] = caffeineData.intakeTime.split(':').map(Number);

    const intakeDate = new Date();
    intakeDate.setHours(intakeHours, intakeMinutes, 0, 0);

    // If intake time is in the future, assume it was yesterday
    if (intakeDate > now) {
        intakeDate.setDate(intakeDate.getDate() - 1);
    }

    // Generate timeline items
    const milestones = [
        { label: '섭취 시각', hours: 0 },
        { label: '1차 반감기', hours: caffeineData.halfLife },
        { label: '2차 반감기', hours: caffeineData.halfLife * 2 },
        { label: '3차 반감기', hours: caffeineData.halfLife * 3 },
        { label: '4차 반감기', hours: caffeineData.halfLife * 4 },
        { label: '거의 완전 제거', hours: caffeineData.halfLife * 5 }
    ];

    milestones.forEach(milestone => {
        const timeAtMilestone = new Date(intakeDate.getTime() + milestone.hours * 60 * 60 * 1000);
        const amount = calculateCaffeineAtTime(milestone.hours * 60);

        const item = document.createElement('div');
        item.className = 'timeline-item';

        const isPast = timeAtMilestone < now;
        const opacity = isPast ? '1' : '0.6';
        item.style.opacity = opacity;

        item.innerHTML = `
            <div>
                <span class="timeline-time">${formatTime(timeAtMilestone)}</span>
                <span class="timeline-label">${milestone.label}</span>
            </div>
            <div class="timeline-amount">${Math.round(amount)} mg</div>
        `;

        timeline.appendChild(item);
    });
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function createChart() {
    const ctx = document.getElementById('caffeine-chart').getContext('2d');

    // Destroy existing chart if any
    if (chart) {
        chart.destroy();
    }

    // Generate data points for 24 hours
    const labels = [];
    const data = [];

    const now = new Date();
    const [intakeHours, intakeMinutes] = caffeineData.intakeTime.split(':').map(Number);

    const intakeDate = new Date();
    intakeDate.setHours(intakeHours, intakeMinutes, 0, 0);

    // If intake time is in the future, assume it was yesterday
    if (intakeDate > now) {
        intakeDate.setDate(intakeDate.getDate() - 1);
    }

    // Generate data points every hour for the next 24 hours from intake
    for (let i = 0; i <= 24; i++) {
        const timePoint = new Date(intakeDate.getTime() + i * 60 * 60 * 1000);
        const minutesElapsed = i * 60;
        const amount = calculateCaffeineAtTime(minutesElapsed);

        labels.push(formatTime(timePoint));
        data.push(amount);
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(139, 69, 19, 0.5)');
    gradient.addColorStop(1, 'rgba(139, 69, 19, 0.05)');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '카페인 (mg)',
                data: data,
                borderColor: '#8B4513',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#8B4513',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(44, 44, 44, 0.95)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `카페인: ${Math.round(context.parsed.y)} mg`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' mg';
                        },
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});
