import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  SkipForward,
  Target,
  FileText,
  Camera,
  Zap,
  Download,
  Settings,
  AlertCircle,
} from "lucide-react";
import EnhancedChart from "@/components/ui/enhanced-chart";
import { useMobile } from "@/hooks/useMobile";
import MobileNavigation from "@/components/ui/mobile-navigation";
import {
  TestRunner,
  calculateCoverage,
  mockTestSuites,
  performanceTestUtils,
  visualTestUtils,
  TestSuite,
  TestCase,
} from "@/utils/testing";
import {
  staggerContainer,
  staggerItem,
  elevateHover,
} from "@/utils/animations";

const TestingDashboard: React.FC = () => {
  const mobile = useMobile();
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
  });
  const [testRunner] = useState(new TestRunner());
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [currentSuite, setCurrentSuite] = useState<TestSuite | null>(null);
  const [testResults, setTestResults] = useState<TestSuite[]>(mockTestSuites);
  const [selectedSuite, setSelectedSuite] = useState<string>("unit-tests");

  // Test coverage data
  const coverage = calculateCoverage(testResults);

  // Test execution timeline data
  const testTimeline = [
    { time: "9:00", unit: 85, integration: 91, e2e: 78, performance: 82 },
    { time: "9:15", unit: 87, integration: 89, e2e: 80, performance: 85 },
    { time: "9:30", unit: 85, integration: 92, e2e: 78, performance: 88 },
    { time: "9:45", unit: 89, integration: 91, e2e: 82, performance: 84 },
    { time: "10:00", unit: 85, integration: 91, e2e: 78, performance: 87 },
  ];

  useEffect(() => {
    testRunner.onProgress((progress, suite) => {
      setTestProgress(progress);
      setCurrentSuite(suite || null);
    });
  }, [testRunner]);

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    try {
      const results = await testRunner.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error("Test execution failed:", error);
    } finally {
      setIsRunningTests(false);
      setTestProgress(0);
      setCurrentSuite(null);
    }
  };

  const runTestSuite = async (suiteId: string) => {
    setIsRunningTests(true);
    setTestProgress(0);
    try {
      const result = await testRunner.runTestSuite(suiteId);
      setTestResults((prev) =>
        prev.map((suite) => (suite.id === suiteId ? result : suite)),
      );
    } catch (error) {
      console.error("Test suite execution failed:", error);
    } finally {
      setIsRunningTests(false);
      setTestProgress(0);
      setCurrentSuite(null);
    }
  };

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "passing":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failing":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "skipped":
        return <SkipForward className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "passing":
        return "bg-green-100 text-green-800 border-green-200";
      case "failing":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "skipped":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportTestReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      testSuites: testResults,
      coverage,
      summary: {
        totalTests: testResults.reduce(
          (acc, suite) => acc + suite.totalTests,
          0,
        ),
        passingTests: testResults.reduce(
          (acc, suite) => acc + suite.passingTests,
          0,
        ),
        failingTests: testResults.reduce(
          (acc, suite) => acc + suite.failingTests,
          0,
        ),
        overallCoverage: coverage.overall,
        totalDuration: testResults.reduce(
          (acc, suite) => acc + suite.duration,
          0,
        ),
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `test-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {mobile.isMobile && <MobileNavigation />}

      <motion.div
        className={`min-h-screen p-4 md:p-6 bg-gray-50 ${mobile.isMobile ? "pt-20 pb-20" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1
                className={`${mobile.isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-900`}
              >
                <span style={{ color: "rgb(61, 153, 76)" }}>
                  Testing Dashboard
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive test coverage and quality assurance monitoring
              </p>
              {isRunningTests && (
                <div className="flex items-center gap-2 mt-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-primary font-medium">
                    Running tests... {testProgress}%
                    {currentSuite && (
                      <span className="text-gray-600">
                        {" "}
                        ({currentSuite.name})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size={mobile.isMobile ? "sm" : "default"}
                onClick={exportTestReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                size={mobile.isMobile ? "sm" : "default"}
                onClick={runAllTests}
                disabled={isRunningTests}
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Test Progress */}
          {isRunningTests && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Test Execution Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        {testProgress}%
                      </span>
                    </div>
                    <Progress value={testProgress} className="h-3" />
                    {currentSuite && (
                      <p className="text-sm text-gray-600">
                        Currently running: {currentSuite.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Test Suite Overview */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {testResults.map((suite, index) => (
              <motion.div
                key={suite.id}
                variants={staggerItem}
                whileHover={elevateHover.hover}
              >
                <Card className="transition-all duration-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h3 className="font-medium text-sm">{suite.name}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => runTestSuite(suite.id)}
                        disabled={isRunningTests}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tests</span>
                          <span className="font-medium">
                            {suite.passingTests}/{suite.totalTests}
                          </span>
                        </div>
                        <Progress
                          value={(suite.passingTests / suite.totalTests) * 100}
                          className="h-2 mt-1"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Coverage
                          </span>
                          <span className="font-medium">{suite.coverage}%</span>
                        </div>
                        <Progress value={suite.coverage} className="h-2 mt-1" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Duration: {suite.duration}ms</span>
                        <span>{suite.lastRun}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Tabs
            value={selectedSuite}
            onValueChange={setSelectedSuite}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="unit-tests">Unit Tests</TabsTrigger>
              <TabsTrigger value="integration-tests">Integration</TabsTrigger>
              <TabsTrigger value="e2e-tests">E2E Tests</TabsTrigger>
              <TabsTrigger value="coverage">Coverage</TabsTrigger>
            </TabsList>

            {/* Test Details */}
            {testResults.map((suite) => (
              <TabsContent
                key={suite.id}
                value={suite.id}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{suite.name}</CardTitle>
                      <CardDescription>{suite.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {suite.tests.map((test, index) => (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(test.status)}
                                <div>
                                  <h4 className="font-medium">{test.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {test.description}
                                  </p>
                                  {test.error && (
                                    <p className="text-xs text-red-600 mt-1">
                                      {test.error}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <p className="font-medium">{test.duration}ms</p>
                                <p className="text-gray-500">Duration</p>
                              </div>
                              {test.coverage && (
                                <div className="text-center">
                                  <p className="font-medium">
                                    {test.coverage}%
                                  </p>
                                  <p className="text-gray-500">Coverage</p>
                                </div>
                              )}
                              <div className="text-center">
                                <p className="text-xs text-gray-500">
                                  {test.lastRun}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}

            {/* Coverage Report */}
            <TabsContent value="coverage" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Coverage Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Overall Coverage</span>
                          <span className="font-bold text-lg">
                            {coverage.overall.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={coverage.overall} className="h-3" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Statements</span>
                            <span className="text-sm font-medium">
                              {coverage.statements.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={coverage.statements}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Branches</span>
                            <span className="text-sm font-medium">
                              {coverage.branches.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={coverage.branches} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Functions</span>
                            <span className="text-sm font-medium">
                              {coverage.functions.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={coverage.functions}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Lines</span>
                            <span className="text-sm font-medium">
                              {coverage.lines.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={coverage.lines} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Coverage by Test Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(coverage.byType).map(([type, value]) => (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium capitalize">
                              {type} Tests
                            </span>
                            <span className="font-medium">
                              {value.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <EnhancedChart
                  data={testTimeline}
                  type="line"
                  title="Test Coverage Trends"
                  subtitle="Coverage trends by test type over time"
                  xKey="time"
                  yKey={["unit", "integration", "e2e", "performance"]}
                  height={300}
                  interactive={true}
                  animated={true}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default TestingDashboard;
