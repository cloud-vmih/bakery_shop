import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  DatePicker,
  Button,
  Space,
  Statistic,
  Table,
  Tag,
  Empty,
  Spin,
  Avatar,
  message,
  Modal,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  PieChartOutlined,
  BarChartOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ShopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import dayjs from "dayjs";
import { exportDashboardToExcel } from "../utils/exportExcel";
import { getDashboardData } from "../services/dashboard.service";
import "../styles/Dashboard.css";
import { Header } from "../components/Header";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const COLORS = ["#52c41a", "#13c2c2", "#1890ff", "#722ed1", "#eb2f96", "#faad14", "#f5222d"];

interface DashboardData {
  summary: {
    netRevenue: number;
    grossRevenue: number;
    totalOrders: number;
    successfulOrders: number;
    processingOrders: number;
    canceledOrders: number;
    totalCakesSold: number;
    aov: number;
    newCustomers: number;
    cancelRate: number;
    returningRate?: number;
    revenueChangePercent?: number;
  };
  revenueChart: Array<{ name: string; revenue: number; orders: number; aov: number }>;
  topProducts: Array<{ name: string; sold: number; revenue: number; percent: number }>;
  orderStatusPie: Array<{ name: string; value: number }>;
  hourlyOrders: Array<{ hour: string; orders: number }>;
  topCancelReasons?: Array<{ reason: string; count: number }>;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().startOf("day"),
    dayjs(),
  ]);
  const [data, setData] = useState<DashboardData>({
    summary: {
      netRevenue: 0,
      grossRevenue: 0,
      totalOrders: 0,
      successfulOrders: 0,
      processingOrders: 0,
      canceledOrders: 0,
      totalCakesSold: 0,
      aov: 0,
      newCustomers: 0,
      cancelRate: 0,
    },
    revenueChart: [],
    topProducts: [],
    orderStatusPie: [],
    hourlyOrders: [],
    topCancelReasons: [],
  });

  // Modal chi tiết
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const from = dateRange?.[0]?.format("YYYY-MM-DD");
      const to = dateRange?.[1]?.format("YYYY-MM-DD");

      const res = await getDashboardData({ from, to });
      setData(res || {
        summary: { netRevenue: 0, grossRevenue: 0, totalOrders: 0, successfulOrders: 0, processingOrders: 0, canceledOrders: 0, totalCakesSold: 0, aov: 0, newCustomers: 0, cancelRate: 0 },
        revenueChart: [],
        topProducts: [],
        orderStatusPie: [],
        hourlyOrders: [],
        topCancelReasons: [],
      });
    } catch (err: any) {
      if (err.message.includes("Network") || err.response?.status >= 400) {
        message.error("Không thể kết nối đến server. Vui lòng kiểm tra mạng hoặc thử lại sau.");
      }
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const quickRanges = [
    { label: "Hôm nay", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Hôm qua", value: [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")] },
    { label: "7 ngày gần nhất", value: [dayjs().subtract(6, "day"), dayjs()] },
    { label: "30 ngày gần nhất", value: [dayjs().subtract(29, "day"), dayjs()] },
    { label: "Tháng này", value: [dayjs().startOf("month"), dayjs()] },
    { label: "Tháng trước", value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")] },
  ];

  const periodDays = dateRange ? dayjs(dateRange[1]).diff(dateRange[0], "day") + 1 : 1;

  // Tương tác: Click cột doanh thu → chi tiết ngày
  const handleBarClick = (entry: any) => {
    setModalTitle(`Chi tiết ngày ${entry.name}`);
    setModalContent(
      <div>
        <p><strong>Doanh thu:</strong> ₫{entry.revenue.toLocaleString()}</p>
        <p><strong>Số đơn:</strong> {entry.orders || "Chưa có dữ liệu"}</p>
        <p><strong>AOV:</strong> ₫{entry.aov || 0}</p>
        <p className="text-gray-500 mt-4">* Chức năng xem danh sách đơn chi tiết ngày này sẽ được triển khai ở phiên bản tiếp theo</p>
      </div>
    );
    setModalVisible(true);
  };

  // Tương tác: Click top sản phẩm → chi tiết sản phẩm
  const handleProductClick = (product: any) => {
    setModalTitle(`Chi tiết sản phẩm: ${product.name}`);
    setModalContent(
      <div>
        <p><strong>Số lượng bán:</strong> {product.sold}</p>
        <p><strong>Doanh thu:</strong> ₫{product.revenue.toLocaleString()}</p>
        <p><strong>Đóng góp:</strong> {product.percent}%</p>
      </div>
    );
    setModalVisible(true);
  };

  return (
    <>
    <Header />
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-header-wrapper">
          <div className="flex items-center gap-6">
            <div className="dashboard-header-icon">
              <BarChartOutlined style={{ fontSize: 48 }} />
            </div>
            <div>
              <Title level={1} className="dashboard-header-title">
                Dashboard Tổng Quan
              </Title>
              <Text className="dashboard-header-subtitle">
                Theo dõi hoạt động kinh doanh cửa hàng bánh ngọt
              </Text>
            </div>
          </div>

          <Space size="middle">
            <Button icon={<ReloadOutlined />} onClick={fetchDashboardData}>
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => exportDashboardToExcel(data, dateRange)}
            >
              Xuất báo cáo Excel
            </Button>
          </Space>
        </div>
      </div>

      {/* BỘ LỌC THỜI GIAN */}
      <Card className="dashboard-filter-card" title="Bộ lọc thời gian">
        <Space size="middle" wrap>
          {quickRanges.map((range) => (
            <Button
              key={range.label}
              type={
                dateRange?.[0].isSame(range.value[0], "day") && dateRange?.[1].isSame(range.value[1], "day")
                  ? "primary"
                  : "default"
              }
              onClick={() => setDateRange(range.value as [dayjs.Dayjs, dayjs.Dayjs])}
            >
              {range.label}
            </Button>
          ))}
          <RangePicker
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          />
        </Space>
      </Card>

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {/* TỔNG QUAN NHANH */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="summary-card">
              <Statistic
                title="Doanh thu thuần"
                value={data.summary.netRevenue}
                precision={0}
                prefix="₫"
                styles={{ content: { color: "#1a5f1a" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="summary-card">
              <Statistic
                title="Tổng đơn hàng"
                value={data.summary.totalOrders}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="summary-card">
              <Statistic
                title="Đơn trung bình (AOV)"
                value={data.summary.aov}
                precision={0}
                prefix="₫"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="summary-card">
              <Statistic
                title="Khách hàng mới"
                value={data.summary.newCustomers}
                prefix={<UserAddOutlined />}
                styles={{ content: { color: "#1890ff" } }}
              />
            </Card>
          </Col>
        </Row>

        {/* SO SÁNH KỲ TRƯỚC & KHÁCH QUAY LẠI */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="summary-card">
              <Statistic
                title="Doanh thu so với kỳ trước"
                value={data.summary.revenueChangePercent || 0}
                precision={1}
                styles={{ content: { color: (data.summary.revenueChangePercent || 0) >= 0 ? "#1a5f1a" : "#f5222d" } }}
                prefix={(data.summary.revenueChangePercent || 0) >= 0 ? "↑" : "↓"}
                suffix="%"
              />
              <Text type="secondary">So với {periodDays} ngày trước</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="summary-card">
              <Statistic
                title="Tỷ lệ khách quay lại"
                value={data.summary.returningRate || 0}
                suffix="%"
                styles={{ content: { color: "#1a5f1a" } }}
              />
              <Text type="secondary">Khách đặt hơn 1 đơn trong kỳ</Text>
            </Card>
          </Col>
        </Row>

        {/* BIỂU ĐỒ DOANH THU & TRẠNG THÁI */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} lg={12}>
            <Card title="Doanh thu theo ngày (Click cột để xem chi tiết)" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.revenueChart} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip
                    formatter={(value: number | undefined) => `₫${value?.toLocaleString() || 0}`}
                    labelFormatter={(label) => `Ngày: ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#52c41a" cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Trạng thái đơn hàng" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.orderStatusPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.orderStatusPie.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* TOP LÝ DO HỦY */}
        {data.topCancelReasons && data.topCancelReasons.length > 0 && (
          <Card title="Top lý do hủy đơn phổ biến" className="mb-8">
            <Table
              dataSource={data.topCancelReasons}
              pagination={false}
              rowKey="reason"
              columns={[
                { title: "Lý do hủy", dataIndex: "reason" },
                { title: "Số lần", dataIndex: "count", align: "center" as const },
                {
                  title: "%",
                  render: (_, record) => (
                    <Tag color="volcano">
                      {data.summary.canceledOrders > 0
                        ? Math.round((record.count / data.summary.canceledOrders) * 100)
                        : 0}%
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        )}

        {/* TOP SẢN PHẨM - có tương tác */}
        <Card title="Top sản phẩm bán chạy" className="mb-8">
          <Table
            dataSource={data.topProducts}
            pagination={false}
            rowKey="name"
            columns={[
              {
                title: "Hình ảnh",
                render: () => <Avatar shape="square" size={64} icon={<ShopOutlined />} />,
              },
              {
                title: "Tên sản phẩm",
                dataIndex: "name",
                render: (text, record) => (
                  <Button type="link" onClick={() => handleProductClick(record)} style={{ padding: 0, color: "#1a5f1a" }}>
                    <strong>{text}</strong> <EyeOutlined style={{ marginLeft: 8 }} />
                  </Button>
                ),
              },
              { title: "Số lượng bán", dataIndex: "sold", align: "center" as const },
              { title: "Doanh thu", dataIndex: "revenue", render: (v) => `₫${v.toLocaleString()}` },
              { title: "% đóng góp", dataIndex: "percent", render: (p) => <Tag color="green">{p}%</Tag> },
            ]}
          />
        </Card>

        {/* ĐƠN HÀNG THEO GIỜ */}
        <Card title="Đơn hàng theo khung giờ (giờ cao điểm)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <ReTooltip formatter={(value) => `${value} đơn`} />
              <Line type="monotone" dataKey="orders" stroke="#52c41a" strokeWidth={3} dot={{ fill: "#52c41a" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {!loading && data.summary.totalOrders === 0 && (
          <Empty
            description="Chưa có dữ liệu bán hàng trong khoảng thời gian này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="mt-8"
          />
        )}
      </Spin>

      {/* Modal chi tiết tương tác */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        {modalContent}
      </Modal>
    </div>
    </>
  );
};

export default Dashboard;