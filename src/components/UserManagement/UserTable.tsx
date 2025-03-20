import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  MoreHorizontal,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Shield,
  Edit,
  Key,
  UserX,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import BulkActionMenu from "./BulkActionMenu";
import AddUserModal from "./AddUserModal";
import {
  getUsers,
  deleteUser,
  changeUserStatus,
  resetUserPassword,
} from "@/lib/users";
import { User } from "@/types/users";
import { useToast } from "../ui/use-toast";
import UserMFAControls from "./UserMFAControls";
import { logActivity } from "@/lib/activityLogger";

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UserTableProps {
  initialUsers?: User[];
  onSort?: (column: string) => void;
  onFilter?: (text: string) => void;
  onUserAction?: (action: string, userId: string) => void;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
}

const UserTable = ({
  initialUsers,
  onSort = () => {},
  onFilter = () => {},
  onUserAction = () => {},
  pagination = { page: 1, pageSize: 10, total: 30 },
  onPageChange = () => {},
}: UserTableProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    userId: string;
    userName?: string;
  } | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      filterUsers(searchQuery);
    }
  }, [users, searchQuery]);

  const filterUsers = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery) ||
        user.status.toLowerCase().includes(lowercaseQuery),
    );

    setFilteredUsers(filtered);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = async (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id || ""));

      // Log the bulk selection to audit logs
      try {
        await logActivity({
          action_type: "bulk_user_selection",
          details: `Selected all ${filteredUsers.length} users`,
          status: "success",
        });
      } catch (error) {
        console.error("Failed to log bulk selection:", error);
      }
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleUserCreated = (userData: {
    name: string;
    email: string;
    role: string;
  }) => {
    // Refresh the user list after a new user is created
    fetchUsers();
    setShowAddModal(false);
    setEditUser(null);
  };

  const handleToggleMFA = async (userId: string, enabled: boolean) => {
    try {
      // In a real implementation, this would update the user's MFA settings in the database
      // For now, we'll just log the action
      await logActivity({
        action_type: enabled ? "auth_mfa_enabled" : "auth_mfa_disabled",
        entity_id: userId,
        entity_type: "user",
        details: { by_admin: true },
        status: "success",
      });

      // Update the local state to reflect the change
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, mfa_enabled: enabled } : user,
        ),
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === userId ? { ...user, mfa_enabled: enabled } : user,
        ),
      );

      toast({
        title: "MFA Setting Updated",
        description: `MFA has been ${enabled ? "enabled" : "disabled"} for the user.`,
      });
    } catch (error) {
      console.error("Failed to update MFA setting:", error);
      toast({
        title: "Error",
        description: "Failed to update MFA setting",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    setProcessingAction(userId);
    try {
      await deleteUser(userId);
      toast({
        title: "Success",
        description: "User has been deleted successfully",
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
      setConfirmAction(null);
    }
  };

  const handleChangeUserStatus = async (
    userId: string,
    status: "active" | "suspended" | "revoked",
  ) => {
    setProcessingAction(userId);
    try {
      await changeUserStatus(userId, status);
      toast({
        title: "Success",
        description: `User status has been changed to ${status}`,
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to change user status:", error);
      toast({
        title: "Error",
        description: "Failed to change user status",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
      setConfirmAction(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser || !newPassword) return;

    setProcessingAction(resetPasswordUser.id);
    try {
      await resetUserPassword(resetPasswordUser.id, newPassword);
      toast({
        title: "Success",
        description: `Password has been reset for ${resetPasswordUser.name}`,
      });
      setResetPasswordUser(null);
      setNewPassword("");
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setNewPassword(newPassword);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "revoked":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superAdmin":
      case "Super Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "owner":
      case "Owner":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "complianceManager":
      case "Compliance Manager":
        return "bg-green-100 text-green-800 border-green-200";
      case "complianceOfficer":
      case "Compliance Officer":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "agent":
      case "Agent":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const toggleSort = (column: string) => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    onSort(column);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 w-1/3">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onFilter(e.target.value);
            }}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-4">
          {selectedUsers.length > 0 && (
            <BulkActionMenu selectedCount={selectedUsers.length} />
          )}
          <Button
            onClick={() => {
              setEditUser(null);
              setShowAddModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                  disabled={filteredUsers.length === 0}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Name{" "}
                {sortDirection === "asc" ? (
                  <SortAsc className="inline w-4 h-4" />
                ) : (
                  <SortDesc className="inline w-4 h-4" />
                )}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MFA</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-gray-500"
                >
                  {searchQuery ? "No matching users found" : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id || "")}
                      onCheckedChange={(checked) =>
                        handleSelectUser(user.id || "", checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-medium border border-gray-200">
                        {user.name
                          .split(" ")
                          .map((name) => name.charAt(0))
                          .join("")}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getRoleBadgeColor(user.role)}
                    >
                      {user.role.includes("Admin") ||
                      user.role.includes("Manager") ||
                      user.role.includes("Officer")
                        ? user.role
                        : user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeColor(user.status)}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserMFAControls
                      userId={user.id || ""}
                      userName={user.name}
                      mfaEnabled={user.mfa_enabled || false}
                      onToggleMFA={handleToggleMFA}
                    />
                  </TableCell>
                  <TableCell>
                    {processingAction === user.id ? (
                      <Button variant="ghost" size="icon" disabled>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setResetPasswordUser({
                                id: user.id || "",
                                name: user.name,
                              })
                            }
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUserAction("security", user.id || "")
                            }
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Security Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmAction({
                                  type: "suspend",
                                  userId: user.id || "",
                                  userName: user.name,
                                })
                              }
                              className="text-amber-600"
                            >
                              Suspend Access
                            </DropdownMenuItem>
                          ) : user.status === "suspended" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmAction({
                                  type: "activate",
                                  userId: user.id || "",
                                  userName: user.name,
                                })
                              }
                              className="text-green-600"
                            >
                              Activate User
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmAction({
                                type: "revoke",
                                userId: user.id || "",
                                userName: user.name,
                              })
                            }
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Revoke Access
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setConfirmAction({
                                type: "delete",
                                userId: user.id || "",
                                userName: user.name,
                              })
                            }
                            className="text-red-600"
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
          {pagination.total} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page * pagination.pageSize >= pagination.total}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog for various actions */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "delete"
                ? `Are you sure you want to delete user ${confirmAction.userName}? This action cannot be undone.`
                : confirmAction?.type === "revoke"
                  ? `Are you sure you want to revoke access for ${confirmAction.userName}? This action requires multi-signature approval and cannot be easily undone.`
                  : confirmAction?.type === "suspend"
                    ? `Are you sure you want to suspend access for ${confirmAction.userName}? The user will not be able to log in until reactivated.`
                    : confirmAction?.type === "activate"
                      ? `Are you sure you want to reactivate ${confirmAction.userName}? The user will regain access to the system.`
                      : "Are you sure you want to proceed with this action?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  if (confirmAction.type === "delete") {
                    handleDeleteUser(confirmAction.userId);
                  } else if (confirmAction.type === "revoke") {
                    handleChangeUserStatus(confirmAction.userId, "revoked");
                  } else if (confirmAction.type === "suspend") {
                    handleChangeUserStatus(confirmAction.userId, "suspended");
                  } else if (confirmAction.type === "activate") {
                    handleChangeUserStatus(confirmAction.userId, "active");
                  } else {
                    onUserAction(confirmAction.type, confirmAction.userId);
                    setConfirmAction(null);
                  }
                }
              }}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog
        open={!!resetPasswordUser}
        onOpenChange={() => {
          setResetPasswordUser(null);
          setNewPassword("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new password for {resetPasswordUser?.name}. This will
              immediately invalidate their current password.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="flex">
                <Input
                  id="new-password"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={generateRandomPassword}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Password should be at least 8 characters long and include a mix
                of letters, numbers, and special characters.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetPassword}
              disabled={
                !newPassword ||
                newPassword.length < 8 ||
                processingAction !== null
              }
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddUserModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditUser(null);
        }}
        onSubmit={handleUserCreated}
        editUser={editUser}
      />
    </div>
  );
};

export default UserTable;
