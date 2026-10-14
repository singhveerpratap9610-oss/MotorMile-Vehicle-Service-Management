package com.motormile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.motormile.model.ServiceBooking;
import com.motormile.service.MotorMileService;

@SpringBootTest
class MotorMileServiceTest {

    @Autowired
    private MotorMileService motorMileService;

    @Test
    void testCalculateServiceCost_ValidService_ReturnsCorrectCost() {
        double cost = motorMileService.calculateServiceCost("General Service");
        assertEquals(4200.0, cost, "General Service should cost ₹4200");
    }

    @Test
    void testBookService_ValidInput_SetsStatusAndCost() {
        ServiceBooking request = new ServiceBooking();
        request.setService("Engine Check");
        request.setDate("25 Nov 2026");
        request.setTime("10:30");
        request.setNotes("Check engine vibration");

        ServiceBooking saved = motorMileService.bookService(request);

        assertNotNull(saved.getId());
        assertEquals(3000.0, saved.getCost());
        assertEquals("Booked", saved.getStatus());
    }

    @Test
    void testBookService_MissingDate_ThrowsException() {
        ServiceBooking invalidRequest = new ServiceBooking();
        invalidRequest.setService("Oil Change");
        invalidRequest.setDate("");
        invalidRequest.setTime("09:00");

        assertThrows(IllegalArgumentException.class, () -> {
            motorMileService.bookService(invalidRequest);
        });
    }
}