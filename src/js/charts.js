const ctx = document.getElementById('quizChart').getContext('2d');

let savedData = JSON.parse(localStorage.getItem('charData')) || [0,0,0,0,0,0,0];

const data = {
	labels:['Sunday','Monday', 'Thursday', 'Wednesday', 'Tuesday', 'Friday','Saturday'],
	datasets: [ {
		label: 'Correct answers',
		data: savedData,
		backgroundColor: 'rgba(153, 102, 255, 0.2)',
		borderColor: 'rgba(153, 102, 255, 1)',
		borderWidth: 1
	}]
};

const options = {
	scales: {
		y: {
			beginAtZero: true
		}
	}
}

let chart = new Chart(ctx, {
	type: 'bar',
	data: data,
	options: options
});

function updateChart() {
	let dayIndex = new Date().getDay();
	
	data.datasets[0].data[dayIndex]++;
	chart.update();
	
	localStorage.setItem('charData',JSON.stringify(data.datasets[0].data));
	
	console.log('Data saved and updated:', data.datasets[0].data);
}
