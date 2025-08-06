#!/bin/bash

echo "🚀 Starting Client Cost Efficiency Simulator Demo"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Kill existing processes
echo -e "${YELLOW}📋 Cleaning up existing processes...${NC}"
pkill -f "react-scripts start" 2>/dev/null
pkill -f "nodemon server.js" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
pkill -f "node demo-server.js" 2>/dev/null
sleep 2

# Start backend
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd /workspace/backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 5

# Check if backend started
if check_port 5000; then
    echo -e "${GREEN}✅ Backend server running on port 5000${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    echo "Backend log:"
    tail -10 /tmp/backend.log
fi

# Build frontend
echo -e "${BLUE}🏗️  Building React frontend...${NC}"
cd /workspace/frontend
npm run build > /tmp/build.log 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    echo "Build log:"
    tail -10 /tmp/build.log
    exit 1
fi

# Start demo server
echo -e "${BLUE}🌐 Starting demo server...${NC}"
cd /workspace
node demo-server.js > /tmp/demo.log 2>&1 &
DEMO_PID=$!
sleep 5

# Check if demo server started
if check_port 8080; then
    echo -e "${GREEN}✅ Demo server running on port 8080${NC}"
else
    echo -e "${RED}❌ Demo server failed to start${NC}"
    echo "Demo log:"
    tail -10 /tmp/demo.log
fi

echo ""
echo -e "${GREEN}🎉 Demo Setup Complete!${NC}"
echo "========================="
echo ""
echo -e "${BLUE}📱 Access Methods:${NC}"
echo "  • Primary: http://localhost:8080"
echo "  • Frontend only: http://localhost:3000"
echo "  • Backend API: http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}🔧 Features Available:${NC}"
echo "  ✅ Interactive cost simulation"
echo "  ✅ Real-time parameter adjustments"
echo "  ✅ Risk assessment and optimization tips"
echo "  ✅ Interactive charts and visualizations"
echo "  ✅ PDF export functionality"
echo "  ✅ Responsive design for all devices"
echo ""
echo -e "${BLUE}🧪 Test Scenarios:${NC}"
echo "  • Low Risk: 8 people, 80% onshore, 70% automation"
echo "  • Medium Risk: 15 people, 50% onshore, 40% automation"
echo "  • High Risk: 25 people, 30% onshore, 20% automation"
echo ""
echo -e "${YELLOW}💡 Tip: If external access doesn't work, try:${NC}"
echo "  • Check firewall settings"
echo "  • Use port forwarding if in container/VM"
echo "  • Access from inside the same network/container"
echo ""
echo -e "${BLUE}📊 Quick API Test:${NC}"
echo 'curl -X POST http://localhost:5000/api/simulate \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"teamSize":10,"onshorePercentage":70,"automationLevel":60,"cloudUsageLevel":50,"projectDurationMonths":6}'"'"''
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running
trap 'echo -e "\n${YELLOW}🛑 Stopping services...${NC}"; kill $BACKEND_PID $DEMO_PID 2>/dev/null; exit' INT

# Monitor services
while true; do
    sleep 30
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}⚠️  Backend service stopped${NC}"
    fi
    if ! kill -0 $DEMO_PID 2>/dev/null; then
        echo -e "${RED}⚠️  Demo service stopped${NC}"
    fi
done