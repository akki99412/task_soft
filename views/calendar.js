
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        themeSystem: 'bootstrap5',
        events: [
            { title: 'Meeting', start: new Date() },
            { title: 'make', start: new Date(), end: (dayjs().add(2, 'd').startOf('day').toDate()) }
        ]
    });
    calendar.render();
