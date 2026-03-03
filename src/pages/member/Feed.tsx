import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal } from 'lucide-react';
import { posts as initialPosts, Post, generateAvatar } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function MemberFeed() {
  const [postsData, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: `p${Date.now()}`,
      authorId: '2',
      authorName: 'Thomas Dupont',
      authorRole: 'Développeur Full-Stack',
      authorAvatar: generateAvatar('Thomas Dupont', 1),
      content: newPostContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      liked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    toast.success('Publication ajoutée !');
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) return;
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c${Date.now()}`,
                  authorName: 'Thomas Dupont',
                  authorAvatar: generateAvatar('Thomas Dupont', 1),
                  content: replyContent,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );
    setReplyContent('');
    setReplyingTo(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
    if (diffH < 1) return "À l'instant";
    if (diffH < 24) return `il y a ${diffH}h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Le Réseau Social Nomad</h1>
        <p className="text-muted-foreground mt-1">Échangez avec la communauté.</p>
      </div>

      {/* New post */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-start gap-3">
          <img src={generateAvatar('Thomas Dupont', 1)} alt="" className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Textarea
              placeholder="Quoi de neuf dans l'espace ?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[80px] resize-none border-0 bg-muted/50 rounded-xl"
            />
            <div className="flex justify-end mt-3">
              <Button onClick={handlePost} disabled={!newPostContent.trim()} className="gap-2 gradient-primary border-0 text-primary-foreground">
                <Send className="w-4 h-4" /> Publier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {postsData.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-5"
          >
            {/* Author */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-11 h-11 rounded-xl" />
                <div>
                  <p className="text-sm font-semibold">{post.authorName}</p>
                  <p className="text-xs text-muted-foreground">{post.authorRole} · {formatDate(post.createdAt)}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <p className="mt-4 text-sm leading-relaxed">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  post.liked ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                {post.likes}
              </button>
              <button
                onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {post.comments.length}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                <Share2 className="w-4 h-4" /> Partager
              </button>
            </div>

            {/* Comments */}
            <AnimatePresence>
              {post.comments.length > 0 && (
                <motion.div className="mt-3 space-y-3 pl-4 border-l-2 border-border">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2.5">
                      <img src={comment.authorAvatar} alt={comment.authorName} className="w-7 h-7 rounded-lg" />
                      <div className="bg-muted/50 rounded-xl px-3 py-2 flex-1">
                        <p className="text-xs font-semibold">{comment.authorName}</p>
                        <p className="text-xs mt-0.5 text-foreground/80">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reply form */}
            {replyingTo === post.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 flex items-start gap-2.5"
              >
                <img src={generateAvatar('Thomas Dupont', 1)} alt="" className="w-7 h-7 rounded-lg" />
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Écrire une réponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[40px] text-xs resize-none flex-1"
                  />
                  <Button size="sm" onClick={() => handleReply(post.id)} className="gradient-primary border-0 text-primary-foreground self-end">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
