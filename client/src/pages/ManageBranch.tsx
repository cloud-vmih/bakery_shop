import { useEffect, useState } from "react";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../services/branch.services";
import BranchModal from "../components/BranchForm";
import toast from "react-hot-toast";
import { useUser } from "../context/authContext";
import { Header } from "../components/Header";

export default function BranchPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const { user } = useUser();

  const fetchBranches = async () => {
    const res = await getBranches();
    setBranches(res);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // CREATE
  const handleCreate = async (data: any) => {
    const res = await createBranch({
      name: data.branch.name,
      placeId: data.address.placeId,
      formattedAddress: data.address.formattedAddress,
      latitude: data.address.latitude,
      longitude: data.address.longitude,
    });
    toast.success(res.toString())
    setOpenModal(false);
    fetchBranches();
  };

  // UPDATE
  const handleUpdate = async (data: any) => {
    const res = await updateBranch(selectedBranch.id, data);
    toast.success(res.toString())
    setOpenModal(false);
    setSelectedBranch(null);
    fetchBranches();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this branch?")) return;
    const res = await deleteBranch(id);
    toast.success(res.toString())
    fetchBranches();
  };

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
            <p className="text-gray-400 mt-4">Hãy nhấn nút "Create New Branch" để thêm chi nhánh đầu tiên.</p>
          </div>
        ) : (
            <div className="flex justify-between mb-4">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="border p-4 flex justify-between mb-3 rounded"
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
