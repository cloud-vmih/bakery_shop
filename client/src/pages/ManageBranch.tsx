import { useEffect, useState } from "react";
import { getBranches, createBranch, updateBranch, deleteBranch, } from "../services/branch.services";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/authContext";
import { Header } from "../components/Header";
import GooglePlaceInput from "../components/AddressAutocomplete";
import MapProvider from "../components/MapProvider";

export default function BranchPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchBranches = async () => {
    const res = await getBranches();
    setBranches(res);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // CREATE
  const handleCreate = async (data: any) => {
    try {
      const res = await createBranch({
        name: data.branch.name,
        placeId: data.address.placeId,
        formattedAddress: data.address.formattedAddress,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      });
      toast.success(res.toString());
      setOpenModal(false);
      fetchBranches();
    }
    catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        navigate("/login")
        toast.error("Vui lòng đăng nhập");
        return;
      }
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
      if (err?.message === "NEED_LOGIN") {
        navigate("/login")
        toast.error("Vui lòng đăng nhập");
        return;
      }
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
      if (err?.message === "NEED_LOGIN") {
        navigate("/login")
        toast.error("Vui lòng đăng nhập");
        return;
      }
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
          formattedAddress: place.fullAddress,
          latitude: place.lat,
          longitude: place.lng,
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
      <Header user={user} />
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Branch Management</h1>
          <button
            onClick={() => {
              setSelectedBranch(null);
              setOpenModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create
          </button>
        </div>

        {branches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Chưa có chi nhánh nào.</p>
            <p className="text-gray-400 mt-4">
              Hãy nhấn nút "Create New Branch" để thêm chi nhánh đầu tiên.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {branches.map((b) => (
              <div
                key={b.id}
                className="border p-4 flex justify-between items-center rounded"
              >
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-sm text-gray-600">
                    {b.address?.fullAddress}
                  </p>
                </div>

                <div className="space-x-2">
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
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <BranchModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedBranch(null);
          }}
          onSubmit={selectedBranch ? handleUpdate : handleCreate}
          initialData={selectedBranch}
        />
      </div>
    </>
  );
}