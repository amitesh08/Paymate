import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import Avatar from "../../components/Avatar";

const SendMoney = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("send");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const fetchedOnceRef = useRef(false); // <- ✅ Prevent double fetch in dev

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (fetchedOnceRef.current) return; // skip 2nd dev call
    fetchedOnceRef.current = true;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/users", {
          withCredentials: true,
        });
        setUsers(res.data.users || []);
        toast.success(res.data.message || "Users fetched");
      } catch (err) {
        toast.error("Could not fetch users");
        console.error(err?.response?.data?.message || err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter((u) =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFiltered(result);
  }, [debouncedSearch, users]);

  const handleTransaction = async () => {
    if (!selectedUser || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    setSending(true);
    try {
      const payload =
        actionType === "send"
          ? {
              receiverId: selectedUser.id,
              amount: Number(amount),
              note: note.trim(),
            }
          : {
              receiverId: selectedUser.id,
              amount: Number(amount),
              note: note.trim(),
            };

      const url =
        actionType === "send"
          ? "http://localhost:8000/api/v1/transactions/send"
          : "http://localhost:8000/api/v1/requests/send";

      const res = await axios.post(url, payload, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Transaction successful");
      setSelectedUser(null);
      setAmount("");
      setNote("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold text-gray-800">
        Send or Request Money
      </h2>

      <input
        type="text"
        placeholder="Search users..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-white shadow-sm rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <Avatar url={user.avatar} name={user.name} />
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType("send");
                  }}
                  className="px-4 py-1 rounded-lg text-white bg-green-500 hover:bg-green-600 text-sm"
                >
                  Send
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType("request");
                  }}
                  className="px-4 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600 text-sm"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === "send" ? "Send" : "Request"} Money to{" "}
              {selectedUser.name}
            </h3>

            <div className="space-y-4">
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <textarea
                placeholder="Add a note (optional)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                disabled={sending}
                onClick={handleTransaction}
                className={`w-full px-4 py-2 rounded-xl text-white font-medium ${
                  actionType === "send"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition ${sending ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {sending
                  ? actionType === "send"
                    ? "Sending..."
                    : "Requesting..."
                  : actionType === "send"
                  ? "Send"
                  : "Request"}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="text-sm text-gray-500 hover:underline mt-2 block mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendMoney;
