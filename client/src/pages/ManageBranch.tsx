import { useEffect, useState, useMemo } from "react";
import { getBranches, createBranch, updateBranch, deleteBranch, } from "../services/branch.service";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { Header } from "../components/Header";
import GooglePlaceInput from "../components/AddressAutocomplete";
import MapProvider from "../components/MapProvider";
import InventoryPopup from "./ManageQuantity";

export default function BranchPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [selectedBranchForInventory, setSelectedBranchForInventory] = useState<number | null>(null);
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Có thể cho người dùng chọn

  const fetchBranches = async () => {
    const res = await getBranches();
    setBranches(res);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

    const filteredBranches = useMemo(() => {
        return branches.filter(branch =>
            branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.address?.fullAddress?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [branches, searchTerm]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBranches = filteredBranches.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

  // CREATE
  const handleCreate = async (data: any) => {
    try {
      const res = await createBranch({
        name: data.branch.name,
        placeId: data.address.placeId,
        fullAddress: data.address.fullAddress,
        lat: data.address.lat,
        lng: data.address.lng,
      });
      toast.success(res.toString());
      setOpenModal(false);
      fetchBranches();
    }
    catch (err: any) {
        toast.error(err.message);
    }
  };

  // UPDATE
  const handleUpdate = async (data: any) => {
    try {
      const res = await updateBranch(selectedBranch.id, data);
      toast.success(res.toString());
      setOpenModal(false);
      setSelectedBranch(null);
      fetchBranches();
    }
    catch (err: any) {
        toast.error(err.message);
      }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!window.confirm("Delete this branch?")) return;
      const res = await deleteBranch(id);
      toast.success(res.toString());
      fetchBranches();
    }
    catch (err: any) {
        toast.error(err.message);
    }
  };

  type ModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
  };

  function BranchModal({
    open,
    onClose,
    onSubmit,
    initialData,
  }: ModalProps) {
    const [name, setName] = useState("");
    const [place, setPlace] = useState<any>(null);

    useEffect(() => {
      if (initialData) {
        setName(initialData.name || "");
        setPlace({
          placeId: initialData.address.placeId,
          fullAddress: initialData.address.fullAddress,
          lat: initialData.address.lat,
          lng: initialData.address.lng,
        });
      } else {
        setName("");
        setPlace(null);
      }
    }, [initialData, open]);

    if (!open) return null;

    const handleSubmit = () => {
      if (!place) return toast.error("Chưa chọn địa chỉ");

      onSubmit({
        branch: { name },
        address: {
          placeId: place.placeId,
          fullAddress: place.fullAddress,
          lat: place.lat,
          lng: place.lng,
        },
      });
    };

    return (
      <MapProvider>
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 w-full max-w-md rounded">
            <h2 className="text-xl font-semibold mb-4">
              {initialData ? "Update Branch" : "Create Branch"}
            </h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Branch name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <GooglePlaceInput onSelect={setPlace} />

            {place && (
              <p className="text-sm text-gray-600 mb-3">
                📍 {place.fullAddress}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </MapProvider>
    );
  }
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header với gradient và shadow */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-white to-emerald-50 rounded-2xl shadow-lg border border-emerald-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                                    Branch Management
                                </h1>
                                <p className="text-emerald-600 mt-2">Manage your bakery branches efficiently</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedBranch(null);
                                    setOpenModal(true);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                <i className="fas fa-plus"></i>
                                Create New Branch
                            </button>
                        </div>
                    </div>

                    {/* Search Box với glassmorphism */}
                    <div className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search branches by name or address..."
                                className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-2xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 text-emerald-800 placeholder-emerald-400"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400"></i>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <p className="text-sm text-emerald-600">
                                Found <span className="font-semibold">{filteredBranches.length}</span> branch{filteredBranches.length !== 1 ? 'es' : ''}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                <span>Show:</span>
                                <select
                                    className="bg-white border border-emerald-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>per page</span>
                            </div>
                        </div>
                    </div>

                    {/* Branch List Grid */}
                    {currentBranches.length === 0 ? (
                        <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-emerald-200">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                <i className="fas fa-store text-3xl text-emerald-400"></i>
                            </div>
                            <p className="text-xl font-semibold text-emerald-700 mb-2">
                                {searchTerm ? "No matching branches" : "No branches yet"}
                            </p>
                            <p className="text-emerald-500 mb-6">
                                {searchTerm ? "Try a different search term" : "Create your first branch to get started"}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="px-6 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors font-medium"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Pagination Info Top */}
                            <div className="mb-6 text-sm text-emerald-600 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100">
                                Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-semibold">{Math.min(indexOfLastItem, filteredBranches.length)}</span> of{" "}
                                <span className="font-semibold">{filteredBranches.length}</span> entries
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {currentBranches.map((b) => (
                                    <div
                                        key={b.id}
                                        className="group bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-2xl overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                                    <i className="fas fa-store text-white text-xl"></i>
                                                </div>
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                                Branch ID: {b.id}
                                            </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-emerald-800 mb-2 group-hover:text-emerald-700 transition-colors">
                                                {b.name}
                                            </h3>

                                            <div className="flex items-start gap-2 text-emerald-600 mb-6">
                                                <i className="fas fa-map-marker-alt mt-1 text-emerald-400"></i>
                                                <p className="text-sm leading-relaxed">{b.address?.fullAddress}</p>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setInventoryModalOpen(true);
                                                        setSelectedBranchForInventory(b.id);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                                >
                                                    <i className="fas fa-utensils"></i>
                                                    <span>Menu</span>
                                                </button>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const branchToEdit = {
                                                                id: b.id,
                                                                name: b.name || "",
                                                                address: b.address ? { ...b.address } : null,
                                                            };
                                                            setSelectedBranch(branchToEdit);
                                                            setOpenModal(true);
                                                        }}
                                                        className="w-12 h-12 flex items-center justify-center bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.id)}
                                                        className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-emerald-600 hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-md'
                                        }`}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>

                                    {getPageNumbers().map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChange(number)}
                                            className={`w-12 h-12 flex items-center justify-center rounded-xl font-semibold transition-all ${currentPage === number
                                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                                                : 'bg-white text-emerald-600 hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300'
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-emerald-600 hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-md'
                                        }`}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Modals */}
                    <BranchModal
                        open={openModal}
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedBranch(null);
                        }}
                        onSubmit={selectedBranch ? handleUpdate : handleCreate}
                        initialData={selectedBranch}
                    />

                    <InventoryPopup
                        branchId={selectedBranchForInventory || 0}
                        open={inventoryModalOpen}
                        onClose={() => {
                            setInventoryModalOpen(false);
                            setSelectedBranchForInventory(null);
                        }}
                    />
                </div>
            </div>
        </>
    );
}