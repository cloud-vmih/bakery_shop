import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Typography,
  message,
  Spin,
  Button,
  Tooltip,
  Badge,
  Avatar,
  Card,
  Popover,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DollarCircleOutlined,
  QuestionCircleOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  FilterOutlined,
  FileSearchOutlined,
  TrophyOutlined,
  ReloadOutlined,
  DeleteOutlined,
  
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Modal } from "antd";
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../services/orders.service";
import "../styles/OrderManagement.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface OrderRecord {
  id: number;
  createAt: string;
  customer?: {
    fullName?: string;
    phoneNumber?: string;
  };
  paymentMethod?: string;
  payStatus?: string;
  cancelStatus?: string;
  status?: string;
   cancelReason?: string;     // Lý do khách hàng hủy
  cancelNote?: string;       // Ghi chú admin khi xử lý/hủy
  orderInfo?: {
    note?: string;           // Ghi chú chung của đơn hàng (thường dùng để lưu lịch sử hủy)
  };
 orderDetails?: Array<{
    quantity: number;                 // quantity nằm ở đây
    item?: {                          // ← đúng tên là "item"
      name?: string;
      price?: number;
      description?: string;
    };
  }>;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders(filters);
      setOrders(res.data || res);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const canAdminCancel = (order: OrderRecord) => {
    return !["DELIVERING", "COMPLETED", "CANCELED"].includes(order.status || "");
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Không thể cập nhật");
    }
  };

  const handleCancelOrder = (order: OrderRecord) => {
  let adminNote = ""; // Đổi tên biến cho đúng nghĩa

  Modal.confirm({
    title: "Xác nhận hủy đơn hàng",
    icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
    content: (
      <>
        <Text strong>Bạn có chắc chắn muốn hủy đơn hàng #{order.id}?</Text>
        <Text type="secondary" style={{ display: "block", margin: "8px 0" }}>
          Hành động này không thể hoàn tác.
        </Text>
        <Input.TextArea
          placeholder="Nhập lý do hủy (ghi chú nội bộ - bắt buộc)"
          rows={3}
          onChange={(e) => (adminNote = e.target.value)}
          style={{ marginTop: 12 }}
        />
      </>
    ),
    okText: "Hủy đơn",
    okType: "danger",
    cancelText: "Thoát",
    onOk: async () => {
      if (!adminNote.trim()) {
        message.error("Vui lòng nhập lý do hủy");
        return Promise.reject();
      }
      try {
        await cancelOrder(order.id, adminNote.trim());
        message.success("Đã hủy đơn hàng thành công");
        fetchOrders();
      } catch (err: any) {
        message.error(err.response?.data?.message || "Không thể hủy đơn hàng");
      }
    },
  });
};

  const handlePrintInvoice = (id: number) => {
    window.open(`http://localhost:5000/api/manage-orders/${id}/print`, "_blank");
  };

  const columns: ColumnsType<OrderRecord> = [
    {
      title: <>Ngày đặt <CalendarOutlined /></>,
      dataIndex: "createAt",
      width: 140,
      sorter: (a, b) => dayjs(a.createAt).unix() - dayjs(b.createAt).unix(),
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text strong>{dayjs(date).format("DD/MM/YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format("HH:mm")}
          </Text>
        </Space>
      ),
    },
    {
      title: <>Khách hàng <UserOutlined /></>,
      width: 220,
      render: (_, record) => (
        <Space>
          <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: "#d9f7be" }} />
          <div>
            <Text strong>{record.customer?.fullName || "Khách lẻ"}</Text>
            {record.customer?.phoneNumber && (
              <div>
                <PhoneOutlined style={{ fontSize: 12, color: "#666" }} />{" "}
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {record.customer.phoneNumber}
                </Text>
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: <>Thanh toán <DollarCircleOutlined /></>,
      width: 130,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.paymentMethod === "BANKING" ? "success" : "warning"}>
            {record.paymentMethod === "BANKING" ? "Chuyển khoản" : "COD"}
          </Tag>
          <Tag color={record.payStatus === "PAID" ? "success" : "default"}>
            {record.payStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
          </Tag>
        </Space>
      ),
    },
    {
      title: <>Yêu cầu hủy <QuestionCircleOutlined /></>,
      width: 140,
      dataIndex: "cancelStatus",
      render: (status) => {
        if (!status || status === "NONE") return <Tag>Không</Tag>;
        const map: any = {
          REQUESTED: (
            <Badge status="processing">
              <Tag color="orange">
                <SyncOutlined spin /> Chờ duyệt
              </Tag>
            </Badge>
          ),
          APPROVED: (
            <Tag color="success">
              <CheckSquareOutlined /> Đã duyệt
            </Tag>
          ),
          REJECTED: (
            <Tag color="error">
              <CloseSquareOutlined /> Từ chối
            </Tag>
          ),
        };
        return map[status] || status;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (status) => {
        const map: any = {
          PENDING: { color: "warning", icon: <ClockCircleOutlined />, text: "Chờ xác nhận" },
          CONFIRMED: { color: "processing", icon: <CheckCircleOutlined />, text: "Đã xác nhận" },
          PREPARING: { color: "default", icon: <SyncOutlined spin />, text: "Đang chuẩn bị" },
          DELIVERING: { color: "purple", icon: <TruckOutlined />, text: "Đang giao" },
          COMPLETED: { color: "success", icon: <TrophyOutlined />, text: "Hoàn thành" },
          CANCELED: { color: "error", icon: <CloseCircleOutlined />, text: "Đã hủy" },
        };
        const item = map[status] || {};
        return (
          <Tag color={item.color} icon={item.icon}>
            {item.text || status}
          </Tag>
        );
      },
    },
 {
  title: "Sản phẩm",
  width: 250,
  render: (_, record) => {
    const details = record.orderDetails || [];

    if (details.length === 0) {
      return <Text type="secondary">-</Text>;
    }

    // Nếu chỉ có 1 món → hiển thị ngắn gọn
    if (details.length === 1) {
      const detail = details[0];
      return (
        <Text>
          <strong>{detail.item?.name || "Sản phẩm"}</strong> × {detail.quantity}
        </Text>
      );
    }

    // Nếu có nhiều món → hiển thị dạng list hoặc popover để đẹp
    return (
      <Popover
        title="Chi tiết sản phẩm"
        content={
          <Space direction="vertical" size={4}>
            {details.map((detail: any, index: number) => (
              <div key={index}>
                <Text strong>{detail.item?.name || "Sản phẩm"}</Text> × {detail.quantity}
                <br />
                <Text type="secondary">
                  {(detail.item?.price || 0).toLocaleString()} VNĐ
                </Text>
              </div>
            ))}
            <Divider style={{ margin: "8px 0" }} />
            <Text strong>
              Tổng tiền:{" "}
              {details
                .reduce(
                  (sum: number, d: any) =>
                    sum + d.quantity * (d.item?.price || 0),
                  0
                )
                .toLocaleString()}{" "}
              VNĐ
            </Text>
          </Space>
        }
        trigger="hover"
      >
        <Button type="link" size="small" style={{ padding: 0 }}>
          {details.length} món <EyeOutlined />
        </Button>
      </Popover>
    );
  },
},
{
  title: "Ghi chú",
  width: 200,
  render: (_, record) => {
    const note = record.orderInfo?.note;
    if (!note) return <Text type="secondary">-</Text>;

    // Nếu ghi chú dài → cắt ngắn và hover xem full
    if (note.length > 30) {
      return (
        <Popover content={note} title="Ghi chú đầy đủ">
          <Text type="secondary" style={{ fontSize: 13 }}>
            {note.substring(0, 30)}...
          </Text>
        </Popover>
      );
    }

    return <Text type="secondary" style={{ fontSize: 13 }}>{note}</Text>;
  },
},

    {
      title: "Lý do hủy",
      width: 240,
      render: (_, record) => {
        if (!record.cancelReason && !record.cancelNote) return "-";

        return (
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            {record.cancelReason && (
              <div>
                <Text type="danger" strong>Khách:</Text>{" "}
                <Popover content={record.cancelReason} title="Lý do từ khách">
                  <Text underline style={{ cursor: "pointer", color: "#ff4d4f" }}>
                    {record.cancelReason.length > 35
                      ? record.cancelReason.slice(0, 35) + "..."
                      : record.cancelReason}
                  </Text>
                </Popover>
              </div>
            )}
            {record.cancelNote && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" strong>Admin:</Text>{" "}
                <Popover content={record.cancelNote} title="Ghi chú nội bộ">
                  <Text italic style={{ color: "#666", cursor: "pointer" }}>
                    {record.cancelNote.length > 35
                      ? record.cancelNote.slice(0, 35) + "..."
                      : record.cancelNote}
                  </Text>
                </Popover>
              </div>
            )}
          </div>
        );
      },
    },
    
   {
  title: "Hành động",
  key: "actions",
  fixed: "right",
  width: 320, // Tăng nhẹ để đủ chỗ cho các button
  align: "center", // Căn giữa toàn bộ nội dung cột
  render: (_, record) => (
    <Space 
      size={6} 
      wrap={false} 
      style={{ 
        display: "flex", 
        justifyContent: "center",
        flexWrap: "nowrap"
      }}
    >
  

      {record.status === "PENDING" && (
        <Tooltip title="Xác nhận đơn">
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleUpdateStatus(record.id, "CONFIRMED")}
          />
        </Tooltip>
      )}

      {record.status === "CONFIRMED" && (
        <Tooltip title="Chuẩn bị hàng">
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<SyncOutlined spin />}
            onClick={() => handleUpdateStatus(record.id, "PREPARING")}
          />
        </Tooltip>
      )}

      {record.status === "PREPARING" && (
        <Tooltip title="Bắt đầu giao">
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<TruckOutlined />}
            onClick={() => handleUpdateStatus(record.id, "DELIVERING")}
          />
        </Tooltip>
      )}

      {record.status === "DELIVERING" && (
        <Tooltip title="Hoàn thành">
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<TrophyOutlined />}
            onClick={() => handleUpdateStatus(record.id, "COMPLETED")}
          />
        </Tooltip>
      )}

      {canAdminCancel(record) && (
        <Tooltip title="Hủy đơn">
          <Button
            danger
            shape="circle"
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleCancelOrder(record)}
          />
        </Tooltip>
      )}

      <Tooltip title="In hóa đơn">
        <Button
          shape="circle"
          size="small"
          icon={<PrinterOutlined />}
          onClick={() => handlePrintInvoice(record.id)}
        />
      </Tooltip>

      {record.cancelStatus === "REQUESTED" && (
        <Badge dot status="processing" offset={[6, 0]}>
          <Button type="dashed" danger size="small">
            Yêu cầu hủy
          </Button>
        </Badge>
      )}
    </Space>
  ),
},
  ];

  return (
    <div className="order-management-page">
      {/* Header Card */}
      <Card className="header-card">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <TruckOutlined />
            </div>
            <div>
              <Title level={2} className="header-title">
                Quản Lý Đơn Hàng
              </Title>
              <Text type="secondary">Theo dõi và xử lý đơn hàng một cách hiệu quả</Text>
            </div>
          </div>
          <Button
            icon={loading ? <SyncOutlined spin /> : <ReloadOutlined />}
            onClick={fetchOrders}
            size="large"
          >
            Làm mới
          </Button>
        </div>
      </Card>

      {/* Filter Card - Grid đẹp, responsive */}
      <Card className="filter-card" title={<><FilterOutlined /> Bộ lọc tìm kiếm</>}>
        <div className="filter-grid">
          <div className="filter-item">
            <label>ID đơn hàng</label>
            <Input
              placeholder="Nhập ID đơn hàng"
              prefix={<FileSearchOutlined />}
              allowClear
              onChange={(e) => {
                const v = e.target.value?.trim();
                setFilters(v ? { ...filters, orderId: v } : (({ orderId, ...rest }) => rest)(filters));
              }}
            />
          </div>

          <div className="filter-item">
            <label>Tên khách hàng</label>
            <Input
              placeholder="Nhập tên khách hàng"
              prefix={<UserOutlined />}
              allowClear
              onChange={(e) => {
                const v = e.target.value?.trim();
                setFilters(v ? { ...filters, customerName: v } : (({ customerName, ...rest }) => rest)(filters));
              }}
            />
          </div>

          <div className="filter-item">
            <label>Số điện thoại</label>
            <Input
              placeholder="Nhập số điện thoại"
              prefix={<PhoneOutlined />}
              allowClear
              onChange={(e) => {
                const v = e.target.value?.trim();
                setFilters(v ? { ...filters, phone: v } : (({ phone, ...rest }) => rest)(filters));
              }}
            />
          </div>

          <div className="filter-item">
            <label>Trạng thái đơn hàng</label>
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(v) => setFilters(v ? { ...filters, status: v } : (({ status, ...rest }) => rest)(filters))}
            >
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="PREPARING">Đang chuẩn bị</Option>
              <Option value="DELIVERING">Đang giao</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELED">Đã hủy</Option>
            </Select>
          </div>

          <div className="filter-item">
            <label>Phương thức thanh toán</label>
            <Select
              placeholder="Chọn phương thức"
              allowClear
              style={{ width: "100%" }}
              onChange={(v) => setFilters(v ? { ...filters, paymentMethod: v } : (({ paymentMethod, ...rest }) => rest)(filters))}
            >
              <Option value="COD">COD</Option>
              <Option value="BANKING">Chuyển khoản</Option>
            </Select>
          </div>

          <div className="filter-item">
            <label>Khoảng thời gian</label>
            <RangePicker
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              style={{ width: "100%" }}
              onChange={(_, strings) => {
                if (!strings[0] && !strings[1]) {
                  const { fromDate, toDate, ...rest } = filters;
                  setFilters(rest);
                } else {
                  setFilters({ ...filters, fromDate: strings[0], toDate: strings[1] });
                }
              }}
            />
          </div>

          <div className="filter-item">
            <label>Trạng thái thanh toán</label>
            <Select
              placeholder="Chọn trạng thái"
              allowClear
              style={{ width: "100%" }}
              onChange={(v) => setFilters(v ? { ...filters, payStatus: v } : (({ payStatus, ...rest }) => rest)(filters))}
            >
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="PENDING">Chưa thanh toán</Option>
              <Option value="REFUNDED">Đã hoàn tiền</Option>
            </Select>
          </div>

          <div className="filter-item">
            <label>Yêu cầu hủy đơn</label>
            <Select
              placeholder="Chọn trạng thái hủy"
              allowClear
              style={{ width: "100%" }}
              onChange={(v) => setFilters(v ? { ...filters, cancelStatus: v } : (({ cancelStatus, ...rest }) => rest)(filters))}
            >
              <Option value="REQUESTED">Đang chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt hủy</Option>
              <Option value="REJECTED">Từ chối</Option>
            </Select>
          </div>

          <div className="filter-item filter-actions">
            <Space size={12}>
              <Button type="primary" icon={<SearchOutlined />} onClick={fetchOrders} size="large">
                Tìm kiếm
              </Button>
              <Button icon={<DeleteOutlined />} onClick={() => setFilters({})} size="large">
                Xóa bộ lọc
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="table-card">
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={orders}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
            }}
            scroll={{ x: 1500 }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default OrderManagement;