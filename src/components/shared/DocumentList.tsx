import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  File,
  MoreHorizontal,
  Download,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

interface DocumentListProps {
  entityId: string;
  entityType: "issuer" | "investor";
  onDocumentAction?: (action: string, document: any) => void;
  refreshTrigger?: number; // Increment this to trigger a refresh
}

const DocumentList: React.FC<DocumentListProps> = ({
  entityId,
  entityType,
  onDocumentAction,
  refreshTrigger = 0,
}) => {
  const { getEntityDocuments, updateDocumentStatus, deleteDocument, loading } =
    useOnboarding();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [entityId, entityType, refreshTrigger]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getEntityDocuments(entityType, entityId);
      setDocuments(docs || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (documentId: string, newStatus: string) => {
    try {
      await updateDocumentStatus(documentId, newStatus);
      fetchDocuments(); // Refresh the list
      if (onDocumentAction) {
        onDocumentAction("statusChange", { id: documentId, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocument(documentToDelete);
      fetchDocuments(); // Refresh the list
      if (onDocumentAction) {
        onDocumentAction("delete", { id: documentToDelete });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setDocumentToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileIcon = (filePath: string) => {
    const ext = filePath?.split(".")?.pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <File className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <File className="h-5 w-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <File className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No documents found</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload documents using the form above
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                        {getFileIcon(doc.file_path)}
                      </div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>{formatDate(doc.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {doc.file_url && (
                          <DropdownMenuItem
                            onClick={() => window.open(doc.file_url, "_blank")}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        )}
                        {doc.file_url && (
                          <DropdownMenuItem
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = doc.file_url;
                              link.download = doc.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);

                              if (onDocumentAction) {
                                onDocumentAction("download", doc);
                              }
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        {doc.status !== "approved" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(doc.id, "approved")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {doc.status !== "rejected" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(doc.id, "rejected")
                            }
                          >
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {doc.status !== "pending" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(doc.id, "pending")
                            }
                          >
                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                            Mark as Pending
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setDocumentToDelete(doc.id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentList;
